





#include "mozilla/Components.h"
#include "mozilla/Maybe.h"
#include "mozilla/PageloadEvent.h"
#include "mozilla/RandomNum.h"
#include "mozilla/ScopeExit.h"
#include "mozilla/glean/DomMetrics.h"
#include "mozilla/glean/GleanPings.h"

#include "nsIChannel.h"
#include "nsIEffectiveTLDService.h"
#include "nsITransportSecurityInfo.h"
#include "nsIURI.h"
#include "nsIX509Cert.h"
#include "nsThreadUtils.h"

#include "ScopedNSSTypes.h"
#include "cert.h"
#include "portreg.h"

namespace mozilla::performance::pageload_event {


uint32_t PageloadEventData::sPageLoadEventCounter = 0;











#ifdef EARLY_BETA_OR_EARLIER
static constexpr uint64_t kNormalSamplingInterval = 1;  
#else
static constexpr uint64_t kNormalSamplingInterval = 10;  
#endif


#ifdef NIGHTLY_BUILD
static constexpr uint64_t kDomainSamplingInterval = 10;  
#else
static constexpr uint64_t kDomainSamplingInterval =
    1000;  
#endif

PageloadEventType GetPageloadEventType() {
  static_assert(kDomainSamplingInterval >= kNormalSamplingInterval,
                "kDomainSamplingInterval should always be higher than "
                "kNormalSamplingInterval");

  Maybe<uint64_t> rand = mozilla::RandomUint64();
  if (rand.isSome()) {
    uint64_t result =
        static_cast<uint64_t>(rand.value() % kDomainSamplingInterval);
    if (result == 0) {
      return PageloadEventType::kDomain;
    }
    result = static_cast<uint64_t>(rand.value() % kNormalSamplingInterval);
    if (result == 0) {
      return PageloadEventType::kNormal;
    }
  }
  return PageloadEventType::kNone;
}

void PageloadEventData::SetDocumentFeature(DocumentFeature aFeature) {
  uint32_t value = 0;
  if (documentFeatures.isSome()) {
    value = documentFeatures.value();
  }
  value |= aFeature;
  documentFeatures = mozilla::Some(value);
}

void PageloadEventData::SetUserFeature(UserFeature aFeature) {
  uint32_t value = 0;
  if (userFeatures.isSome()) {
    value = userFeatures.value();
  }
  value |= aFeature;
  userFeatures = mozilla::Some(value);
}









static bool DomainMatchesWildcard(char* cn, const char* hn,
                                  nsCString& newDomainOut) {
  if (!cn) {
    return false;
  }

  
  const bool wildcard = PORT_Strncmp(cn, "*.", 2) == 0;

  if (!wildcard) {
    return false;
  }

  
  const char* cn_suffix = cn + 2;

  
  const char* hn_suffix = PORT_Strchr(hn, '.');
  if (!hn_suffix) {
    return false;
  }

  
  hn_suffix++;

  
  if (!PORT_Strchr(hn_suffix, '.')) {
    return false;
  }

  
  
  if (PORT_Strcasecmp(cn_suffix, hn_suffix) == 0) {
    newDomainOut.Assign(cn_suffix);
    return true;
  }

  return false;
}








bool PageloadEventData::MaybeSetPublicRegistrableDomain(nsCOMPtr<nsIURI> aURI,
                                                        nsIChannel* aChannel) {
  MOZ_ASSERT(aChannel, "Expecting a valid channel.");

  nsCOMPtr<nsIEffectiveTLDService> tldService =
      mozilla::components::EffectiveTLD::Service();
  if (!tldService) {
    return false;
  }

  
  nsCOMPtr<nsILoadInfo> loadInfo = aChannel->LoadInfo();
  if (loadInfo->GetIpAddressSpace() != nsILoadInfo::IPAddressSpace::Public) {
    return false;
  }

  nsCOMPtr<nsITransportSecurityInfo> tsi;
  nsresult rv = aChannel->GetSecurityInfo(getter_AddRefs(tsi));
  if (NS_FAILED(rv) || !tsi) {
    return false;
  }

  
  bool rootIsBuiltIn = false;
  rv = tsi->GetIsBuiltCertChainRootBuiltInRoot(&rootIsBuiltIn);
  if (NS_FAILED(rv) || !rootIsBuiltIn) {
    return false;
  }

  
  bool hasKnownPublicSuffix = false;
  rv = tldService->HasKnownPublicSuffix(aURI, &hasKnownPublicSuffix);
  if (NS_FAILED(rv) || !hasKnownPublicSuffix) {
    return false;
  }

  
  nsCOMPtr<nsIX509Cert> cert;
  rv = tsi->GetServerCert(getter_AddRefs(cert));
  if (NS_FAILED(rv) || !cert) {
    return false;
  }

  UniqueCERTCertificate nssCert(cert->GetCert());
  if (!nssCert) {
    return false;
  }

  
  nsAutoCString currentBaseDomain;
  rv = tldService->GetBaseDomain(aURI, 0, currentBaseDomain);
  if (NS_FAILED(rv) || currentBaseDomain.IsEmpty()) {
    return false;
  }

  SECStatus secrv = SECFailure;

  
  
  const size_t cnBufLen = 255;
  char cnBuf[cnBufLen];

  UniquePLArenaPool arena(PORT_NewArena(DER_DEFAULT_CHUNKSIZE));
  if (!arena) {
    return false;
  }

  
  SECItem subAltName = {siBuffer, nullptr, 0};
  auto onScopeExit = mozilla::MakeScopeExit(
      [&]() { SECITEM_FreeItem(&subAltName, PR_FALSE); });

  secrv = CERT_FindCertExtension(nssCert.get(), SEC_OID_X509_SUBJECT_ALT_NAME,
                                 &subAltName);
  if (secrv != SECSuccess) {
    return false;
  }

  CERTGeneralName* nameList =
      CERT_DecodeAltNameExtension(arena.get(), &subAltName);
  if (!nameList) {
    return false;
  }

  
  
  
  CERTGeneralName* current = nameList;
  const char* hn = currentBaseDomain.get();
  do {
    if (current->type == certDNSName) {
      
      secrv = CERT_RFC1485_EscapeAndQuote(cnBuf, cnBufLen,
                                          (char*)current->name.other.data,
                                          current->name.other.len);
      if (secrv != SECSuccess) {
        return false;
      }

      nsCString newDomain;
      if (DomainMatchesWildcard(cnBuf, hn, newDomain)) {
        mDomain = mozilla::Some(newDomain);
        return true;
      }
    }
    current = CERT_GetNextGeneralName(current);
  } while (current && current != nameList);

  
  mDomain = mozilla::Some(currentBaseDomain);
  return true;
}

void PageloadEventData::SendAsPageLoadEvent() {
  mozilla::glean::perf::PageLoadExtra extra;

#define COPY_METRIC(name, type) extra.name = this->name;
  FOR_EACH_PAGELOAD_METRIC(COPY_METRIC)
#undef COPY_METRIC

  mozilla::glean::perf::page_load.Record(mozilla::Some(extra));

  
  if (++sPageLoadEventCounter >= 10) {
    NS_SUCCEEDED(NS_DispatchToMainThreadQueue(
        NS_NewRunnableFunction(
            "PageLoadPingIdleTask",
            [] { mozilla::glean_pings::Pageload.Submit("threshold"_ns); }),
        EventQueuePriority::Idle));
    sPageLoadEventCounter = 0;
  }
}

static mozilla::Maybe<uint32_t> AddMultiplicativeNoise(
    const mozilla::Maybe<uint32_t>& input, double relativeRange = 0.10) {
  mozilla::Maybe<uint64_t> rand = mozilla::RandomUint64();
  if (!input || !rand) {
    return mozilla::Nothing{};
  }

  
  double normalizedRand =
      static_cast<double>(rand.value()) /
      (static_cast<double>(std::numeric_limits<uint64_t>::max()) + 1.0);

  double multiplier = 1.0 + (normalizedRand * 2.0 - 1.0) * relativeRange;
  uint32_t output =
      static_cast<uint32_t>(std::round(input.value() * multiplier));
  ;
  return mozilla::Some(output);
}

void PageloadEventData::SendAsPageLoadDomainEvent() {
  MOZ_ASSERT(HasDomain());

  mozilla::glean::perf::PageLoadDomainExtra extra;
  extra.domain = this->mDomain;
  extra.httpVer = this->httpVer;
  extra.sameOriginNav = this->sameOriginNav;
  extra.documentFeatures = this->documentFeatures;
  extra.loadType = this->loadType;

  
  extra.lcpTime = AddMultiplicativeNoise(this->lcpTime);

#ifdef NIGHTLY_BUILD
  extra.channel = mozilla::Some("nightly"_ns);
#else
  extra.channel = mozilla::Some("release"_ns);
#endif

  
  mozilla::glean::perf::page_load_domain.Record(mozilla::Some(extra));

  
  
  NS_SUCCEEDED(NS_DispatchToMainThreadQueue(
      NS_NewRunnableFunction("PageloadBaseDomainPingIdleTask",
                             [] {
                               mozilla::glean_pings::PageloadBaseDomain.Submit(
                                   "pageload"_ns);
                             }),
      EventQueuePriority::Idle));
}

}  

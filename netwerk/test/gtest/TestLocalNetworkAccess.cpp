



#include "TestCommon.h"
#include "gtest/gtest.h"
#include "mozilla/gtest/MozAssertions.h"
#include "mozilla/StaticPrefs_network.h"
#include "mozilla/Preferences.h"
#include "mozilla/net/DNS.h"
#include "nsNetUtil.h"
#include "nsIOService.h"

TEST(TestNetAddrLNAUtil, IPAddressSpaceCategorization)
{
  















  using namespace mozilla::net;

  struct TestCase {
    const char* mIp;
    nsILoadInfo::IPAddressSpace mExpectedSpace;
  };

  std::vector<TestCase> testCases = {
      
      {"", nsILoadInfo::IPAddressSpace::Unknown},
      {"127.0.0.1", nsILoadInfo::IPAddressSpace::Local},
      {"198.18.0.0", nsILoadInfo::IPAddressSpace::Local},
      {"198.19.255.255", nsILoadInfo::IPAddressSpace::Local},

      
      {"10.0.0.1", nsILoadInfo::IPAddressSpace::Private},
      {"100.64.0.1", nsILoadInfo::IPAddressSpace::Private},
      {"100.127.255.254", nsILoadInfo::IPAddressSpace::Private},
      {"172.16.0.1", nsILoadInfo::IPAddressSpace::Private},
      {"172.31.255.255", nsILoadInfo::IPAddressSpace::Private},
      {"192.168.1.1", nsILoadInfo::IPAddressSpace::Private},
      {"169.254.0.1", nsILoadInfo::IPAddressSpace::Private},
      {"169.254.255.254", nsILoadInfo::IPAddressSpace::Private},

      
      {"::1", nsILoadInfo::IPAddressSpace::Local},       
      {"fc00::", nsILoadInfo::IPAddressSpace::Private},  
      {"fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
       nsILoadInfo::IPAddressSpace::Private},
      {"fe80::1", nsILoadInfo::IPAddressSpace::Private},  

      
      {"::ffff:127.0.0.1", nsILoadInfo::IPAddressSpace::Local},   
      {"::ffff:10.0.0.1", nsILoadInfo::IPAddressSpace::Private},  
      {"::ffff:1.1.1.1", nsILoadInfo::IPAddressSpace::Public},    

      
      {"8.8.8.8", nsILoadInfo::IPAddressSpace::Public},
      {"1.1.1.1", nsILoadInfo::IPAddressSpace::Public},

      
      {"2001:4860:4860::8888", nsILoadInfo::IPAddressSpace::Public},
      {"2606:4700:4700::1111", nsILoadInfo::IPAddressSpace::Public}};

  for (const auto& testCase : testCases) {
    NetAddr addr;
    addr.InitFromString(nsCString(testCase.mIp));
    if (addr.raw.family == AF_INET) {
      EXPECT_EQ(addr.GetIpAddressSpace(), testCase.mExpectedSpace)
          << "Failed for IP: " << testCase.mIp;
    } else if (addr.raw.family == AF_INET6) {
      EXPECT_EQ(addr.GetIpAddressSpace(), testCase.mExpectedSpace)
          << "Failed for IP: " << testCase.mIp;
    } else {
      EXPECT_EQ(addr.GetIpAddressSpace(), nsILoadInfo::IPAddressSpace::Unknown)
          << "Failed for IP: " << testCase.mIp;
    }
  }
}

TEST(TestNetAddrLNAUtil, DefaultAndOverrideTransitions)
{
  using mozilla::Preferences;
  using mozilla::net::NetAddr;
  using IPAddressSpace = nsILoadInfo::IPAddressSpace;
  struct TestCase {
    const char* ip;
    uint16_t port;
    IPAddressSpace defaultSpace;
    IPAddressSpace overrideSpace;
    const char* prefName;
  };

  std::vector<TestCase> testCases = {
      
      {"8.8.8.8", 80, IPAddressSpace::Public, IPAddressSpace::Private,
       "network.lna.address_space.private.override"},

      
      {"8.8.4.4", 53, IPAddressSpace::Public, IPAddressSpace::Local,
       "network.lna.address_space.local.override"},

      
      {"192.168.0.1", 8080, IPAddressSpace::Private, IPAddressSpace::Public,
       "network.lna.address_space.public.override"},

      
      {"10.0.0.1", 1234, IPAddressSpace::Private, IPAddressSpace::Local,
       "network.lna.address_space.local.override"},

      
      {"127.0.0.1", 4444, IPAddressSpace::Local, IPAddressSpace::Public,
       "network.lna.address_space.public.override"},

      
      {"198.18.0.1", 9999, IPAddressSpace::Local, IPAddressSpace::Private,
       "network.lna.address_space.private.override"},
  };

  for (const auto& tc : testCases) {
    NetAddr addr;
    addr.InitFromString(nsCString(tc.ip), tc.port);
    ASSERT_EQ(addr.GetIpAddressSpace(), tc.defaultSpace)
        << "Expected default space for " << tc.ip << ":" << tc.port;

    std::string overrideStr =
        std::string(tc.ip) + ":" + std::to_string(tc.port);
    Preferences::SetCString(tc.prefName, overrideStr.c_str());

    NetAddr overriddenAddr;
    overriddenAddr.InitFromString(nsCString(tc.ip), tc.port);
    ASSERT_EQ(overriddenAddr.GetIpAddressSpace(), tc.overrideSpace)
        << "Expected override to " << tc.overrideSpace << " for "
        << overrideStr;

    
    Preferences::SetCString(tc.prefName, ""_ns);
    NetAddr resetAddr;
    resetAddr.InitFromString(nsCString(tc.ip), tc.port);
    ASSERT_EQ(resetAddr.GetIpAddressSpace(), tc.defaultSpace)
        << "Expected reset back to default space for " << tc.ip;
  }
}

TEST(TestNetAddrLNAUtil, ShouldSkipDomainForLNA)
{
  using mozilla::Preferences;

  
  nsIOService* ioService = gIOService;
  ASSERT_NE(ioService, nullptr);

  
  Preferences::SetCString("network.lna.skip-domains", ""_ns);
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("example.com"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("test.example.com"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("localhost"_ns));

  
  Preferences::SetCString("network.lna.skip-domains",
                          "example.com,test.org"_ns);
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("example.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("test.org"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("sub.example.com"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("example.org"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("notexample.com"_ns));

  
  Preferences::SetCString("network.lna.skip-domains",
                          "*.example.com,*.test.org"_ns);
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("sub.example.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("deep.sub.example.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("api.test.org"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "example.com"_ns));  
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "test.org"_ns));  
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("example.net"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("notexample.com"_ns));

  
  Preferences::SetCString("network.lna.skip-domains",
                          "*.local,*.internal,*.test"_ns);
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("server.local"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("api.internal"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("service.test"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("deep.subdomain.local"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "local"_ns));  
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "internal"_ns));  
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("local.example.com"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("localhost"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("example.com"_ns));

  
  Preferences::SetCString(
      "network.lna.skip-domains",
      "localhost,*.dev.local,*.staging.com,production.example.com"_ns);
  
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("localhost"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("production.example.com"_ns));
  
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("api.dev.local"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("web.dev.local"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("dev.local"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("test.staging.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("api.staging.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("staging.com"_ns));
  
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("example.com"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("dev.example.com"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("staging.example.com"_ns));

  
  Preferences::SetCString(
      "network.lna.skip-domains",
      " example.com , , *.test.local , admin.internal  "_ns);
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("example.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("api.test.local"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("admin.internal"_ns));
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("test.com"_ns));

  
  Preferences::SetCString("network.lna.skip-domains",
                          "example.com,invalid.pattern"_ns);
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "example.com"_ns));  
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "invalid.pattern"_ns));  
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA("test.com"_ns));  

  
  Preferences::SetCString("network.lna.skip-domains",
                          "Example.COM,*.Test.ORG"_ns);
  EXPECT_TRUE(
      ioService->ShouldSkipDomainForLNA("Example.COM"_ns));  
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA(
      "example.com"_ns));  
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA(
      "api.Test.ORG"_ns));  
  EXPECT_FALSE(ioService->ShouldSkipDomainForLNA(
      "api.test.org"_ns));  

  
  Preferences::SetCString("network.lna.skip-domains", "*"_ns);
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("example.com"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("test.org"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("localhost"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("any.domain.here"_ns));
  EXPECT_TRUE(ioService->ShouldSkipDomainForLNA("server.local"_ns));

  
  Preferences::SetCString("network.lna.skip-domains", ""_ns);
}

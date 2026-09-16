



#ifndef mozilla_dom_Report_h
#define mozilla_dom_Report_h

#include "js/TypeDecls.h"
#include "mozilla/AlreadyAddRefed.h"
#include "mozilla/RefPtr.h"
#include "nsAtom.h"
#include "nsCOMPtr.h"
#include "nsCycleCollectionParticipant.h"
#include "nsISupports.h"
#include "nsString.h"
#include "nsWrapperCache.h"

class nsIGlobalObject;

namespace mozilla::dom {

class ReportBody;

class Report final : public nsISupports, public nsWrapperCache {
 public:
  NS_DECL_CYCLE_COLLECTING_ISUPPORTS_FINAL
  NS_DECL_CYCLE_COLLECTION_WRAPPERCACHE_CLASS(Report)

  Report(nsIGlobalObject* aGlobal, nsAtom* aType, const nsACString& aURL,
         ReportBody* aBody);

  already_AddRefed<Report> Clone();

  JSObject* WrapObject(JSContext* aCx,
                       JS::Handle<JSObject*> aGivenProto) override;

  nsIGlobalObject* GetParentObject() const { return mGlobal; }

  nsAtom* Type() const;

  void GetType(nsACString& aType) const;
  void GetUrl(nsACString& aURL) const;

  ReportBody* GetBody() const;

 private:
  ~Report();

  nsCOMPtr<nsIGlobalObject> mGlobal;

  const RefPtr<nsAtom> mType;
  nsCString mURL;
  RefPtr<ReportBody> mBody;
};

}  

#endif  

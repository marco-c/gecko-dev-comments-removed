










promise_test(() => {
  return fetch(
    "../resources/inspect-headers.py?headers=accept|x-test",
    {headers: {
      "Accept": "before-æøå-after",
      "X-Test": "before-ß-after"
    }})
    .then(res => {
      assert_equals(
          res.headers.get("x-request-accept"),
          "before-æøå-after",
          "Accept Header");
      assert_equals(
          res.headers.get("x-request-x-test"),
          "before-ß-after",
          "X-Test Header");
    });
}, "Non-ascii bytes in request headers");

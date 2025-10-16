


import buildconfig
import mozunit
import mozversioncontrol




allowlist = {}


def test_extra_legacy_tests():
    repo = mozversioncontrol.get_repository_object(buildconfig.topsrcdir)
    for src, fd in repo.get_tracked_files_finder().find("**/moz.build"):
        if src in allowlist:
            continue
        assert (
            b"LegacyTest(" not in fd.read()
        ), f"LegacyTest used in {src}, please refrain and use another test kind."


if __name__ == "__main__":
    mozunit.main()

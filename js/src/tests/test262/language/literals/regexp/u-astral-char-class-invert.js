


























assert.sameValue(/^[^❤️]$/u.exec("❤️"), null);
assert.sameValue(/^[^🧡]/u.exec("🧡"), null);
assert.sameValue(/[^💛]$/u.exec("💛"), null);
assert.sameValue(/[^💚]/u.exec("💚"), null);

reportCompare(0, 0);

import re
from urllib.parse import urlparse


def extract_features(url):
    return {
        "length": len(url),
        "dots": url.count("."),
        "hyphens": url.count("-"),
        "has_ip": int(
            bool(
                re.search(
                    r"\d+\.\d+\.\d+\.\d+",
                    url
                )
            )
        ),
        "login": int("login" in url.lower()),
        "verify": int("verify" in url.lower()),
        "secure": int("secure" in url.lower()),
        "account": int("account" in url.lower()),
        "bank": int("bank" in url.lower()),
    }
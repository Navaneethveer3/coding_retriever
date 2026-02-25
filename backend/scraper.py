import requests
import re
import time
import json
from urllib.parse import urlparse


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
}


def extract_leetcode_username(url: str) -> str:
    """Extract username from LeetCode URL."""
    if not url:
        return None
    url = url.strip().rstrip("/")
    parsed = urlparse(url)
    path_parts = [p for p in parsed.path.split("/") if p]

    if not path_parts:
        return None

    # Handle https://leetcode.com/u/username/ format
    if len(path_parts) >= 2 and path_parts[0] == "u":
        return path_parts[1]

    # Handle https://leetcode.com/username/ format
    # Filter out known non-username paths
    non_username_paths = {"problems", "contest", "discuss", "explore", "playground", "submissions"}
    if path_parts[0] not in non_username_paths:
        return path_parts[0]

    return None


def extract_hackerrank_username(url: str) -> str:
    """Extract username from HackerRank URL."""
    if not url:
        return None
    url = url.strip().rstrip("/")
    parsed = urlparse(url)
    path_parts = [p for p in parsed.path.split("/") if p]

    if not path_parts:
        return None

    # Handle https://www.hackerrank.com/profile/username format
    if len(path_parts) >= 2 and path_parts[0] == "profile":
        return path_parts[1]

    # Handle https://www.hackerrank.com/username format
    non_username_paths = {"dashboard", "domains", "contests", "leaderboard", "jobs", "calendar", "administration"}
    if path_parts[0] not in non_username_paths:
        return path_parts[0]

    return None


def fetch_leetcode_solved(url: str) -> int:
    """Fetch the total number of problems solved on LeetCode."""
    username = extract_leetcode_username(url)
    if not username:
        return 0

    try:
        graphql_url = "https://leetcode.com/graphql"
        query = """
        query userProblemsSolved($username: String!) {
            matchedUser(username: $username) {
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
        """

        response = requests.post(
            graphql_url,
            json={"query": query, "variables": {"username": username}},
            headers={
                **HEADERS,
                "Content-Type": "application/json",
                "Referer": f"https://leetcode.com/{username}/",
                "Origin": "https://leetcode.com",
            },
            timeout=15,
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("data") and data["data"].get("matchedUser"):
                ac_stats = data["data"]["matchedUser"]["submitStatsGlobal"]["acSubmissionNum"]
                for stat in ac_stats:
                    if stat["difficulty"] == "All":
                        return stat["count"]
            return None # User not found in GraphQL
        return None # 404 or other error
    except Exception as e:
        print(f"Error fetching LeetCode data for {username}: {e}")
        return None


def fetch_hackerrank_badges(url: str) -> dict:
    """Fetch HackerRank skill badges/stars for Java, Python, C, SQL."""
    username = extract_hackerrank_username(url)
    result = {"java": 0, "python": 0, "c": 0, "sql": 0}

    if not username:
        return result

    try:
        # Try the badges API endpoint
        badges_url = f"https://www.hackerrank.com/rest/hackers/{username}/badges"
        response = requests.get(
            badges_url,
            headers=HEADERS,
            timeout=15,
        )

        if response.status_code == 200:
            data = response.json()
            models = data.get("models", [])
            for badge in models:
                badge_name = badge.get("badge_name", "").lower()
                stars = badge.get("stars", 0)

                if "java" in badge_name and "javascript" not in badge_name:
                    result["java"] = max(result["java"], stars)
                elif "python" in badge_name:
                    result["python"] = max(result["python"], stars)
                elif badge_name == "c" or badge_name.startswith("c ") or "(c)" in badge_name:
                    result["c"] = max(result["c"], stars)
                elif "sql" in badge_name:
                    result["sql"] = max(result["sql"], stars)

            return result
        return None

    except Exception as e:
        print(f"Error fetching HackerRank badges for {username}: {e}")
        return None

    # Fallback: try the profile API
    try:
        profile_url = f"https://www.hackerrank.com/rest/hackers/{username}"
        response = requests.get(
            profile_url,
            headers=HEADERS,
            timeout=15,
        )

        if response.status_code == 200:
            data = response.json()
            model = data.get("model", {})
            # Try to find skill data in the profile response
            badges = model.get("badges", [])
            for badge in badges:
                badge_name = str(badge.get("badge_name", "")).lower()
                stars = badge.get("stars", 0)

                if "java" in badge_name and "javascript" not in badge_name:
                    result["java"] = max(result["java"], stars)
                elif "python" in badge_name:
                    result["python"] = max(result["python"], stars)
                elif badge_name == "c" or badge_name.startswith("c ") or "(c)" in badge_name:
                    result["c"] = max(result["c"], stars)
                elif "sql" in badge_name:
                    result["sql"] = max(result["sql"], stars)

    except Exception as e:
        print(f"Error fetching HackerRank profile for {username}: {e}")

    return result


def scrape_student_data(leetcode_url: str, hackerrank_url: str) -> dict:
    """Scrape both LeetCode and HackerRank data for a student."""
    leetcode_solved = fetch_leetcode_solved(leetcode_url)
    time.sleep(0.3)  # Small delay to avoid rate limiting
    hr_badges = fetch_hackerrank_badges(hackerrank_url)
    time.sleep(0.3)

    return {
        "leetcode_solved": leetcode_solved,
        "hr_java_stars": hr_badges["java"] if hr_badges else None,
        "hr_python_stars": hr_badges["python"] if hr_badges else None,
        "hr_c_stars": hr_badges["c"] if hr_badges else None,
        "hr_sql_stars": hr_badges["sql"] if hr_badges else None,
    }

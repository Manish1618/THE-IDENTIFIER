"""
Mock data and fallback fixtures for Hackathon Failsafe / Demo Mode.
Ensures the full 3-minute presentation works flawlessly even without API keys or with slow venue Wi-Fi.
"""

SAMPLE_MATCHES = [
    {
        "platform": "Twitter/X",
        "title": "Alex Rivers (@alexrivers_ai) / Keynote at TechSummit 2024",
        "post_url": "https://x.com/alexrivers_ai/status/178923481239841",
        "thumbnail": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        "source": "x.com",
        "detected_date": "2024-05-12",
        "claimed_name": "Alex Rivers",
        "account_handle": "@alexrivers_ai"
    },
    {
        "platform": "Reddit",
        "title": "u/rivers_tech: Discussing Decentralized Identity & Biometrics on r/web3",
        "post_url": "https://reddit.com/r/web3/comments/1cty92p/biometric_zkp_discussion",
        "thumbnail": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        "source": "reddit.com",
        "detected_date": "2024-05-16",
        "claimed_name": "u/rivers_tech",
        "account_handle": "u/rivers_tech"
    },
    {
        "platform": "LinkedIn",
        "title": "Alex Rivers - Chief Architect & AI Researcher at CypherGuard Labs",
        "post_url": "https://linkedin.com/in/alex-rivers-ai",
        "thumbnail": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        "source": "linkedin.com",
        "detected_date": "2024-06-01",
        "claimed_name": "Alex Rivers",
        "account_handle": "alex-rivers-ai"
    },
    {
        "platform": "Web",
        "title": "Speaker Profile: Alex Rivers - Global Cyber Security Conference 2024",
        "post_url": "https://cybersecuritysummit.example.com/speakers/alex-rivers",
        "thumbnail": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
        "source": "cybersecuritysummit.example.com",
        "detected_date": "2024-04-20",
        "claimed_name": "Alex Rivers",
        "account_handle": "speaker-profile"
    }
]

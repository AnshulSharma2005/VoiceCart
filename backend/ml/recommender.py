import sys
import json

def recommend(user_id, current_items, history):
    # TODO: Replace with real ML model
    suggestions = [
        {"id": "ml-1", "name": "Eggs", "category": "dairy", "reason": "Predicted from ML", "confidence": 0.82}
    ]
    return suggestions

if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    user_id = data.get("userId")
    current_items = data.get("currentItems", [])
    history = data.get("history", [])
    
    recs = recommend(user_id, current_items, history)
    print(json.dumps(recs))

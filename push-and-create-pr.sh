#!/bin/bash

# Script to push README changes and create PR for manmohan659 profile

cd /workspace/manmohan659-profile

echo "Current branch:"
git branch --show-current

echo -e "\nChanges committed:"
git log --oneline -1

echo -e "\nPushing to remote..."
git push -u origin update-professional-readme

echo -e "\nCreating pull request..."
gh pr create \
  --title "Update profile README with professional overview" \
  --body "$(cat <<'EOF'
## Summary

Replaced template README with comprehensive professional profile showcasing:

- **ML Engineering Experience**: LangChain/LangGraph agentic workflows, Qwen-16B fine-tuning, RAG pipelines
- **Distributed Systems Expertise**: SSO for 100+ products, gRPC, Kafka, Redis
- **Notable Projects**: CashCanvas, ChatDB, Blockchain Loan Exchange, Drone Memory Management
- **Published Research**: Respiratory sound classification in healthcare
- **Education**: MS in CS (AI) from University of San Francisco

The new README is concise, elegant, and positions the profile at a senior staff engineer level - perfect for recruiters and fellow developers.

## Preview

Visit the branch to see the updated README in action.
EOF
)"

echo -e "\n✅ Done! Your pull request has been created."

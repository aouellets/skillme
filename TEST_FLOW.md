# SkillShelf End-to-End Test Flow

Run this before every major update and before PH launch.

## Tester setup
1. Go to claude.ai → Settings → Integrations
2. Add integration: [MCP URL]
3. Start a new conversation

## Test script
Say each of these in order and confirm Claude responds correctly:

1. "show me skills" → Claude should call browse_skills and list 5 skills
2. "show me coding skills" → should filter to coding category
3. "install the karpathy behavioral rules skill" → should confirm install
4. "what skills do I have installed?" → should list Karpathy rules
5. Start a NEW conversation → Claude should auto-load the installed skill
6. "show me packs" → Claude should call browse_packs and list packs
7. "install the engineering workflow pack" → should confirm 8 skills installed
8. "create a collection called My Favorites" → should confirm collection created

## Expected results
- Each command gets a clear, useful Claude response
- Install counts increase in Supabase after steps 3 and 7
- New conversation in step 5 shows skill content was loaded

## Sign off
- [ ] Tester name:
- [ ] Date:
- [ ] All 8 steps passed: yes / no
- [ ] Issues found:

from pyjsparser import parse

try:
    with open('C:/Users/arcar/.gemini/antigravity/scratch/aprende_mais_sustentavel/minigames.js', 'r', encoding='utf-8') as f:
        code = f.read()
    parse(code)
    print("JS parsed successfully, no syntax errors.")
except Exception as e:
    print(f"Syntax error: {e}")

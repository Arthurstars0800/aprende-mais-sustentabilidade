import re

with open('C:/Users/arcar/.gemini/antigravity/scratch/aprende_mais_sustentavel/minigames.js', 'r', encoding='utf-8') as f:
    text = f.read()

def check_brackets(s):
    stack = []
    lines = s.split('\n')
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if char in '{[(': 
                stack.append((char, i+1, j+1))
            elif char in '}])':
                if not stack:
                    return f'Unmatched closing bracket {char} at line {i+1} col {j+1}'
                last, li, lj = stack.pop()
                if (char == '}' and last != '{') or (char == ']' and last != '[') or (char == ')' and last != '('):
                    return f'Mismatched bracket {char} at line {i+1} col {j+1}. Expected closing for {last} from line {li}'
    if stack:
        return f'Unclosed brackets: {stack}'
    return 'Brackets are balanced!'

def remove_strings_and_comments(code):
    # This is a naive regex that might fail on complex regex literals, but good enough for simple scripts
    code = re.sub(r'//.*', '', code)
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
    # Match strings:
    # Single quotes
    code = re.sub(r"'([^'\\]|\\.)*'", '', code)
    # Double quotes
    code = re.sub(r'"([^"\\]|\\.)*"', '', code)
    # Backticks
    code = re.sub(r'`([^`\\]|\\.)*`', '', code)
    return code

clean_text = remove_strings_and_comments(text)
print(check_brackets(clean_text))

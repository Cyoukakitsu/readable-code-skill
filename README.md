# readable-code-skill

基于《リーダブルコード》（Dustin Boswell / Trevor Foucher 著，角 征典 訳，O'Reilly Japan；原书 *The Art of Readable Code*）提炼的 Claude Code Skill。
让 Claude 在写代码、重构、Code Review 时，按「代码应该让别人理解得尽可能快」的原则给出建议。

内容是对书中原则的**个人归纳与改写**，不包含原书文字。想深入了解请阅读原书。

## 安装

```bash
git clone https://github.com/Cyoukakitsu/readable-code-skill.git
mkdir -p ~/.claude/skills
cp -r readable-code-skill/skills/readable-code ~/.claude/skills/
```

之后在 Claude Code 里写代码或 review 时会自动触发，也可以直接说「用 readable-code 帮我 review 这段代码」。

## 结构

```
skills/readable-code/SKILL.md
```

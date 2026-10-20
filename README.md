# readable-code-skill

基于《リーダブルコード》（Dustin Boswell / Trevor Foucher 著，角 征典 訳，O'Reilly Japan；原书 *The Art of Readable Code*）提炼的 Claude Code Skill。
让 Claude 按「代码应该让别人理解得尽可能快」的原则，对 TypeScript / JavaScript 代码做**可读性审查**。

- **只审查，不改代码**：输出带严重度（must / should / optional）、影响范围和验证依据的指摘列表，是否修改由你决定。
- **只补充 Claude 不知道的东西**：书中的通用原则 Claude 本来就懂。这个 Skill 重点写的是取舍、例外和容易误判的地方（例如：不把信任边界上的防御当成多余代码）。
- 内容是对书中原则的**个人归纳与改写**，示例全部来自作者自己的项目，不包含原书文字和原书示例。想深入了解请阅读原书。
- Skill 正文用日文编写，审查报告会使用提问者的语言。

## 安装

```bash
git clone https://github.com/Cyoukakitsu/readable-code-skill.git
mkdir -p ~/.claude/skills
cp -r readable-code-skill/skills/readable-code-review ~/.claude/skills/
```

之后在 Claude Code 里说「このコード読みやすい？」「可読性レビューして」或 "readability review" 等即可触发，也可以直接说「用 readable-code-review 审查这个文件」。

## 结构

```
skills/readable-code-review/
├── SKILL.md                    # 审查方式、输出格式、注意点
└── references/
    ├── defensive-code.md       # 不必要的防御代码（第 1 章）
    ├── naming.md               # 命名（第 2 章）
    └── compression.md          # 过度压缩的表达式（暂定版）
```

## 进度

随阅读进度逐章追加规则。目前覆盖第 1～2 章，读书笔记发布在 [Qiita](https://qiita.com/ZHAOJIAYI/items/08e7f3ec02133efd1ddc)。

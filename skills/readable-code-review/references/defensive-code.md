# 防御コード

原則: 必要な防御は分かりやすく書き、不要な防御は書かない。

不要な防御の問題は、数行余計なことではない。起こりえない状況を作り出してしまうことだ。読み手はそのケースが本当に起きると思い込み、いつ起きるのかを考えるのに時間を使い、最後に「起きない」と気づく。さらに、黙って握りつぶすフォールバックは、後で取り決めが変わったときに本物のエラーを隠しうる。

## 防御分岐ごとに問う 2 つの質問

1. **その状況を起こしうるのは誰か？**
   - 信頼境界（ユーザー入力、外部 API のレスポンス、LLM の出力、環境変数、Webhook のペイロード、ファイルの内容（`JSON.parse` の結果を含む））は本当に不確実 → 防御を残す。
   - 型システムや、自分たちのモジュール同士の取り決めがすでにそのケースを排除している → 削除候補。
2. **実際に起きたとき、その分岐は意味のあることをできるか？**
   - 復旧する、リトライする、報告する、はっきり失敗させる、は意味がある。
   - デフォルト値や汎用メッセージに差し替えるだけなら、たいていはノイズ。

指摘するのは、質問 1 の答えが「誰もいない」場合。取り決めを読んで確認すること。確認できなければ、SKILL.md のとおり `unverified` を付けて重要度を一段下げる。質問 2 で重要度を決める。将来のエラーを**黙って隠す**フォールバックは `must`（未確認なら `should`）。

## 兆候

- TypeScript がすでに絞り込んだ値に対する `typeof x === "string"` などの判定
- null になりえない型に対する `?? defaultValue` / `|| defaultValue`
- 実在するエラーメッセージと重複するフォールバックの文言（どちらが出たのか読み手が区別できない）
- 捕捉しようとしている例外をそもそも投げえないコードを囲み、エラーを握りつぶしてデフォルト値を返す `try/catch`
- 同じ処理の流れの前段で（zod などで）検証済みのデータを、もう一度検証している

## 例（作者自身のプロジェクトより）

呼び出し先が返すのはこの 3 つだけ:

```ts
// auth.ts
return { error: "Validation failed" };
return { error: "Registration failed. Please try again." };
return { success: true };
```

呼び出し側:

```ts
const result = await signUp(data);
if (result.error) {
  toast.error(
    typeof result.error === "string" ? result.error : "Validation failed",
  );
} else {
  router.push("/sign-in");
}
```

`if (result.error)` の内側では `result.error` は常に文字列なので、フォールバックの文言は決して表示されない。しかも実在するメッセージと重複している。将来 `signUp` が `{ error: { field, message } }` を返すように変わると、フォールバックは黙って "Validation failed" を表示し、誰も気づかない。一方 `toast.error(result.error)` ならコンパイルエラーになり、変更にすぐ気づける。

修正案:

```ts
const result = await signUp(data);
if (result.error) {
  toast.error(result.error);
} else {
  router.push("/sign-in");
}
```

## 指摘しないもの

- 上記の信頼境界から来る値の検証（リクエストボディ、フォーム入力、Webhook のペイロード、LLM の出力、環境変数、`JSON.parse` の結果など）
- 外部から来た `unknown` や `any` 型の値に対するチェック
- チームの方針で必要だとユーザーが明言している防御

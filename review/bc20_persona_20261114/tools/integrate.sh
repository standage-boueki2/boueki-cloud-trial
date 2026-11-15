#!/bin/bash
# 各担当の層（fix/<area>/src）を build/src に集めて、開発用の版（work/trial・work/redesign＝8811）を組み立て直す
#   ./integrate.sh cty up item ops fwd core
set -e
SP=/tmp/claude-0/-home-user-boueki-cloud-trial/9bd64fd7-6adf-583d-a69f-9f4adbf0ff2a/scratchpad
B=$SP/build
for A in "$@"; do
  D=$SP/fix/$A/src
  for f in "$D"/logic_v2192*.ts "$D"/rd_v92*.js "$D"/rd_v92*.css; do
    [ -e "$f" ] || continue
    n=$(basename "$f")
    # 共通の層と同じ名前は受け取らない（担当は自分の名前の層だけを書く決まり）
    case "$n" in logic_v2192cat.ts|logic_v2192per.ts|rd_v92per.js|rd_v92per.css) echo "skip $A/$n（共通の層と同じ名前）"; continue;; esac
    # 中身の無い下書き（数行だけ）は入れない
    if [ "$(wc -c < "$f")" -lt 200 ]; then echo "skip $A/$n（空の下書き）"; continue; fi
    cp "$f" "$B/src/$n"; echo "take $A/$n $(wc -l < "$f") lines"
  done
done
bash $B/mk.sh
# 層どうしで、同じ名前の一番外の宣言がぶつかっていないか（つなげて構文を確かめる）
cat $B/out/logic_v2192*.js > $B/out/_all.js
node -e "const s=require('fs').readFileSync(process.argv[1],'utf8');new Function(s);console.log('layers concat OK',s.length)" $B/out/_all.js

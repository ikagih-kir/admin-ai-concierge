import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  TextField,
  MenuItem,
  Divider,
  Alert,
  Chip,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductEditorLayout from "./components/ProductEditorLayout";
import ProductStatusBanner from "./components/ProductStatusBanner";
import ProductBasicForm from "./components/ProductBasicForm";
import { createProduct } from "@api/products";
import { ProductForm } from "@/types/product";

type MeetingType = "central" | "local";

type PredictionTemplateForm = {
  meetingType: MeetingType;
  venue: string;
  raceNo: string;
  ticketType: string;
  betStyle: string;
  betText: string;

  selectedHorseNumbers: number[];

  axisHorseNumbers: number[];
  opponentHorseNumbers: number[];

  formationFirstNumbers: number[];
  formationSecondNumbers: number[];
  formationThirdNumbers: number[];

  pointCount: number;
  amountPerPoint: number;
  memo: string;
};

const centralVenues = [
  "札幌",
  "函館",
  "福島",
  "新潟",
  "東京",
  "中山",
  "中京",
  "京都",
  "阪神",
  "小倉",
];

const localVenues = [
  "門別",
  "盛岡",
  "水沢",
  "浦和",
  "船橋",
  "大井",
  "川崎",
  "金沢",
  "笠松",
  "名古屋",
  "園田",
  "姫路",
  "高知",
  "佐賀",
];

const raceOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}R`);
const horseNumberOptions = Array.from({ length: 18 }, (_, i) => i + 1);

const ticketTypes = [
  "単勝",
  "複勝",
  "枠連",
  "馬連",
  "馬単",
  "ワイド",
  "3連複",
  "3連単",
];

const betStyles = [
  "通常",
  "軸1頭",
  "軸2頭",
  "ボックス",
  "フォーメーション",
  "流し",
  "マルチ",
];

const countNumbersInBetText = (text: string) => {
  const matches = text.match(/\d+/g);
  if (!matches) return 0;

  // 数字だけ入力した場合の簡易点数計算
  // 例: 1,2,3 → 3点
  // フォーメーション等は正確な計算が複雑なので、初期値として使う
  return matches.length;
};

const combination = (n: number, r: number) => {
  if (n < r || r < 0) return 0;
  if (r === 0 || n === r) return 1;

  let result = 1;
  for (let i = 1; i <= r; i += 1) {
    result = (result * (n - i + 1)) / i;
  }

  return Math.round(result);
};

const permutation = (n: number, r: number) => {
  if (n < r || r < 0) return 0;

  let result = 1;
  for (let i = 0; i < r; i += 1) {
    result *= n - i;
  }

  return result;
};

const uniqueSortedNumbers = (numbers: number[]) => {
  return Array.from(new Set(numbers))
    .filter((n) => n >= 1 && n <= 18)
    .sort((a, b) => a - b);
};

const countTrifectaFormation = (
  first: number[],
  second: number[],
  third: number[]
) => {
  let count = 0;

  for (const a of first) {
    for (const b of second) {
      for (const c of third) {
        if (a !== b && a !== c && b !== c) {
          count += 1;
        }
      }
    }
  }

  return count;
};

const countTrioFormation = (
  first: number[],
  second: number[],
  third: number[]
) => {
  const combos = new Set<string>();

  for (const a of first) {
    for (const b of second) {
      for (const c of third) {
        if (a !== b && a !== c && b !== c) {
          const key = [a, b, c].sort((x, y) => x - y).join("-");
          combos.add(key);
        }
      }
    }
  }

  return combos.size;
};

const calculatePointCount = (params: {
  ticketType: string;
  betStyle: string;
  selectedHorseNumbers: number[];
  axisHorseNumbers: number[];
  opponentHorseNumbers: number[];
  formationFirstNumbers: number[];
  formationSecondNumbers: number[];
  formationThirdNumbers: number[];
}) => {
  const {
    ticketType,
    betStyle,
    selectedHorseNumbers,
    axisHorseNumbers,
    opponentHorseNumbers,
    formationFirstNumbers,
    formationSecondNumbers,
    formationThirdNumbers,
  } = params;

  const selectedCount = uniqueSortedNumbers(selectedHorseNumbers).length;
  const axisCount = uniqueSortedNumbers(axisHorseNumbers).length;
  const opponentCount = uniqueSortedNumbers(opponentHorseNumbers).length;

  const first = uniqueSortedNumbers(formationFirstNumbers);
  const second = uniqueSortedNumbers(formationSecondNumbers);
  const third = uniqueSortedNumbers(formationThirdNumbers);

  if (betStyle === "フォーメーション") {
    if (ticketType === "3連複") {
      return countTrioFormation(first, second, third);
    }

    if (ticketType === "3連単") {
      return countTrifectaFormation(first, second, third);
    }

    return selectedCount;
  }

  if (betStyle === "通常") {
    return selectedCount;
  }

  if (betStyle === "ボックス") {
    switch (ticketType) {
      case "単勝":
      case "複勝":
        return selectedCount;

      case "枠連":
      case "馬連":
      case "ワイド":
        return combination(selectedCount, 2);

      case "馬単":
        return permutation(selectedCount, 2);

      case "3連複":
        return combination(selectedCount, 3);

      case "3連単":
        return permutation(selectedCount, 3);

      default:
        return selectedCount;
    }
  }

  if (betStyle === "軸1頭" || betStyle === "流し") {
    if (axisCount < 1 || opponentCount < 1) return 0;

    switch (ticketType) {
      case "単勝":
      case "複勝":
        return axisCount;

      case "枠連":
      case "馬連":
      case "ワイド":
      case "馬単":
        return axisCount * opponentCount;

      case "3連複":
        return axisCount * combination(opponentCount, 2);

      case "3連単":
        return axisCount * permutation(opponentCount, 2);

      default:
        return axisCount * opponentCount;
    }
  }

  if (betStyle === "軸2頭") {
    if (axisCount < 2 || opponentCount < 1) return 0;

    switch (ticketType) {
      case "3連複":
        return combination(axisCount, 2) * opponentCount;

      case "3連単":
        return combination(axisCount, 2) * opponentCount * 6;

      case "馬連":
      case "ワイド":
      case "馬単":
        return combination(axisCount, 2);

      default:
        return combination(axisCount, 2) * opponentCount;
    }
  }

  if (betStyle === "マルチ") {
    return selectedCount;
  }

  return selectedCount;
};

const buildBetTextFromTemplate = (template: PredictionTemplateForm) => {
  const selected = uniqueSortedNumbers(template.selectedHorseNumbers);
  const axis = uniqueSortedNumbers(template.axisHorseNumbers);
  const opponents = uniqueSortedNumbers(template.opponentHorseNumbers);

  const first = uniqueSortedNumbers(template.formationFirstNumbers);
  const second = uniqueSortedNumbers(template.formationSecondNumbers);
  const third = uniqueSortedNumbers(template.formationThirdNumbers);

  if (template.betStyle === "フォーメーション") {
    if (template.ticketType === "3連単") {
      return [
        `1着: ${first.join(", ") || "-"}`,
        `2着: ${second.join(", ") || "-"}`,
        `3着: ${third.join(", ") || "-"}`,
      ].join("\n");
    }

    if (template.ticketType === "3連複") {
      return [
        `1列目: ${first.join(", ") || "-"}`,
        `2列目: ${second.join(", ") || "-"}`,
        `3列目: ${third.join(", ") || "-"}`,
      ].join("\n");
    }
  }

  if (template.betStyle === "軸1頭" || template.betStyle === "流し") {
    return [
      `軸: ${axis.join(", ") || "-"}`,
      `相手: ${opponents.join(", ") || "-"}`,
    ].join("\n");
  }

  if (template.betStyle === "軸2頭") {
    return [
      `軸: ${axis.join(", ") || "-"}`,
      `相手: ${opponents.join(", ") || "-"}`,
    ].join("\n");
  }

  if (template.betStyle === "ボックス") {
    return `ボックス: ${selected.join(", ") || "-"}`;
  }

  return selected.join(", ");
};

const buildPredictionBody = (template: PredictionTemplateForm) => {
  const totalAmount = template.pointCount * template.amountPerPoint;

  return [
    `【対象レース】`,
    `${template.meetingType === "central" ? "中央競馬" : "地方競馬"}・${
      template.venue || "競馬場未選択"
    } ${template.raceNo || "レース未選択"}`,
    ``,
    `【券種】`,
    template.ticketType || "未選択",
    ``,
    `【買い目形式】`,
    template.betStyle || "未選択",
    ``,
    `【買い目】`,
    template.betText || "未入力",
    ``,
    `【点数】`,
    `${template.pointCount}点`,
    ``,
    `【推奨金額】`,
    `1点あたり ${template.amountPerPoint.toLocaleString()}円`,
    ``,
    `【合計金額】`,
    `${totalAmount.toLocaleString()}円`,
    template.memo.trim() ? `` : null,
    template.memo.trim() ? `【メモ】` : null,
    template.memo.trim() ? template.memo : null,
  ]
    .filter(Boolean)
    .join("\n");
};

const ProductCreatePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    price: 0,
    description: "",
    body: "",
    is_active: true,
    publish_from: "",
    publish_to: "",
    is_sold_out: false,
    sold_out_after: "",
  });

  const [template, setTemplate] = useState<PredictionTemplateForm>({
    meetingType: "central",
    venue: "",
    raceNo: "",
    ticketType: "3連複",
    betStyle: "フォーメーション",
    betText: "",
    selectedHorseNumbers: [],
    axisHorseNumbers: [],
    opponentHorseNumbers: [],
    formationFirstNumbers: [],
    formationSecondNumbers: [],
    formationThirdNumbers: [],
    pointCount: 0,
    amountPerPoint: 100,
    memo: "",
  });

  const venueOptions =
    template.meetingType === "central" ? centralVenues : localVenues;

  const totalAmount = useMemo(() => {
    return template.pointCount * template.amountPerPoint;
  }, [template.pointCount, template.amountPerPoint]);

  const isTrioFormation =
    template.ticketType === "3連複" && template.betStyle === "フォーメーション";

  const isTrifectaFormation =
    template.ticketType === "3連単" && template.betStyle === "フォーメーション";

  const isNagashi =
    (template.ticketType === "馬連" || template.ticketType === "ワイド") &&
    template.betStyle === "流し";

  const handleChangeTemplate = <K extends keyof PredictionTemplateForm>(
    key: K,
    value: PredictionTemplateForm[K]
  ) => {
    setTemplate((prev) => {
      const next = {
        ...prev,
        [key]: value,
        ...(key === "meetingType" ? { venue: "" } : {}),
      };

      const pointCount = calculatePointCount({
        ticketType: next.ticketType,
        betStyle: next.betStyle,
        selectedHorseNumbers: next.selectedHorseNumbers,
        axisHorseNumbers: next.axisHorseNumbers,
        opponentHorseNumbers: next.opponentHorseNumbers,
        formationFirstNumbers: next.formationFirstNumbers,
        formationSecondNumbers: next.formationSecondNumbers,
        formationThirdNumbers: next.formationThirdNumbers,
      });

      return {
        ...next,
        pointCount,
        betText: buildBetTextFromTemplate(next),
      };
    });
  };

  const handleBetTextChange = (value: string) => {
    const numbers = Array.from(
      new Set(
        (value.match(/\d+/g) ?? [])
          .map((v) => Number(v))
          .filter((n) => n >= 1 && n <= 18)
      )
    ).sort((a, b) => a - b);

    const estimatedPointCount = countNumbersInBetText(value);

    setTemplate((prev) => ({
      ...prev,
      betText: value,
      selectedHorseNumbers: numbers,
      pointCount:
        prev.betStyle === "フォーメーション" || prev.betStyle === "マルチ"
          ? estimatedPointCount
          : prev.pointCount,
    }));
  };

  const buildBetTextFromHorseNumbers = (numbers: number[]) => {
    if (numbers.length === 0) return "";

    const sorted = [...numbers].sort((a, b) => a - b);

    return sorted.join(", ");
  };

  const recalculateTemplate = (next: PredictionTemplateForm) => {
    const pointCount = calculatePointCount({
      ticketType: next.ticketType,
      betStyle: next.betStyle,
      selectedHorseNumbers: next.selectedHorseNumbers,
      axisHorseNumbers: next.axisHorseNumbers,
      opponentHorseNumbers: next.opponentHorseNumbers,
      formationFirstNumbers: next.formationFirstNumbers,
      formationSecondNumbers: next.formationSecondNumbers,
      formationThirdNumbers: next.formationThirdNumbers,
    });

    return {
      ...next,
      pointCount,
      betText: buildBetTextFromTemplate(next),
    };
  };

  const toggleNumberInList = (list: number[], number: number) => {
    const exists = list.includes(number);

    return uniqueSortedNumbers(
      exists ? list.filter((n) => n !== number) : [...list, number]
    );
  };

  const handleToggleHorseNumber = (number: number) => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        selectedHorseNumbers: toggleNumberInList(
          prev.selectedHorseNumbers,
          number
        ),
      })
    );
  };

  const handleToggleAxisHorseNumber = (number: number) => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        axisHorseNumbers: toggleNumberInList(prev.axisHorseNumbers, number),
      })
    );
  };

  const handleToggleOpponentHorseNumber = (number: number) => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        opponentHorseNumbers: toggleNumberInList(
          prev.opponentHorseNumbers,
          number
        ),
      })
    );
  };

  const handleToggleFormationFirstNumber = (number: number) => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        formationFirstNumbers: toggleNumberInList(
          prev.formationFirstNumbers,
          number
        ),
      })
    );
  };

  const handleToggleFormationSecondNumber = (number: number) => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        formationSecondNumbers: toggleNumberInList(
          prev.formationSecondNumbers,
          number
        ),
      })
    );
  };

  const handleToggleFormationThirdNumber = (number: number) => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        formationThirdNumbers: toggleNumberInList(
          prev.formationThirdNumbers,
          number
        ),
      })
    );
  };

  const handleClearHorseNumbers = () => {
    setTemplate((prev) =>
      recalculateTemplate({
        ...prev,
        selectedHorseNumbers: [],
        axisHorseNumbers: [],
        opponentHorseNumbers: [],
        formationFirstNumbers: [],
        formationSecondNumbers: [],
        formationThirdNumbers: [],
        betText: "",
        pointCount: 0,
      })
    );
  };

  const applyTemplateToProduct = () => {
    const body = buildPredictionBody(template);

    const autoName = [
      template.venue,
      template.raceNo,
      template.ticketType,
      "無料予想",
    ]
      .filter(Boolean)
      .join(" ");

    const autoDescription = `${template.venue || "対象競馬場"} ${
      template.raceNo || ""
    }の${template.ticketType}予想。${template.pointCount}点 / 合計${totalAmount.toLocaleString()}円`;

    setForm((prev) => ({
      ...prev,
      name: prev.name || autoName,
      description: prev.description || autoDescription,
      body,
      price: 0,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      label: null,
      description: form.description || "",
      body: form.body || "",

      status: "public",
      is_active: form.is_active,

      publish_start_at: form.publish_from || null,
      publish_end_at: form.publish_to || null,

      sold_out: form.is_sold_out,
      sold_out_at:
        form.is_sold_out && form.sold_out_after ? form.sold_out_after : null,

      price: Number(form.price ?? 0),
    };

    try {
      await createProduct(payload as any);
      navigate("/products");
    } catch (error: any) {
      console.error(error);

      if (error?.response) {
        alert(
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "保存に失敗しました（APIエラー）"
        );
      } else {
        alert("保存に失敗しました（通信エラー）");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        無料予想 新規作成
      </Typography>

      <ProductEditorLayout
        left={
          <ProductStatusBanner
            isActive={form.is_active}
            isSoldOut={form.is_sold_out}
            publishFrom={form.publish_from}
            publishTo={form.publish_to}
            soldOutAfter={form.sold_out_after}
            onChangeActive={(v) => setForm({ ...form, is_active: v })}
            onChangeSoldOut={(v) => setForm({ ...form, is_sold_out: v })}
            onChangePublishFrom={(v) => setForm({ ...form, publish_from: v })}
            onChangePublishTo={(v) => setForm({ ...form, publish_to: v })}
            onChangeSoldOutAfter={(v) =>
              setForm({ ...form, sold_out_after: v })
            }
          />
        }
        right={
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    予想テンプレート入力
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    レース情報と買い目を入力すると、無料予想本文を自動生成できます。
                  </Typography>
                </Box>

                <Alert severity="info">
                  まずはテンプレートを入力し、「本文に反映」を押してください。
                  反映後も下の通常フォームで文章を自由に編集できます。
                </Alert>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    select
                    label="中央 / 地方"
                    value={template.meetingType}
                    onChange={(e) =>
                      handleChangeTemplate(
                        "meetingType",
                        e.target.value as MeetingType
                      )
                    }
                    fullWidth
                  >
                    <MenuItem value="central">中央競馬</MenuItem>
                    <MenuItem value="local">地方競馬</MenuItem>
                  </TextField>

                  <TextField
                    select
                    label="競馬場"
                    value={template.venue}
                    onChange={(e) =>
                      handleChangeTemplate("venue", e.target.value)
                    }
                    fullWidth
                  >
                    {venueOptions.map((venue) => (
                      <MenuItem key={venue} value={venue}>
                        {venue}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="レース"
                    value={template.raceNo}
                    onChange={(e) =>
                      handleChangeTemplate("raceNo", e.target.value)
                    }
                    fullWidth
                  >
                    {raceOptions.map((race) => (
                      <MenuItem key={race} value={race}>
                        {race}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    select
                    label="券種"
                    value={template.ticketType}
                    onChange={(e) =>
                      handleChangeTemplate("ticketType", e.target.value)
                    }
                    fullWidth
                  >
                    {ticketTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="買い目形式"
                    value={template.betStyle}
                    onChange={(e) =>
                      handleChangeTemplate("betStyle", e.target.value)
                    }
                    fullWidth
                  >
                    {betStyles.map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <TextField
                  label="買い目"
                  placeholder={
                    template.betStyle === "フォーメーション"
                      ? "例）1列目: 3 / 2列目: 1,5,8 / 3列目: 1,2,5,8,10"
                      : "例）3,5,8,10"
                  }
                  value={template.betText}
                  onChange={(e) => handleBetTextChange(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  helperText="現時点では簡易的に数字の数から点数を推定します。必要に応じて点数は手動修正してください。"
                />

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={800}>
                          馬番選択
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          券種と買い目形式に応じて、点数を自動計算します。
                        </Typography>
                      </Box>
                
                      <Button size="small" onClick={handleClearHorseNumbers}>
                        クリア
                      </Button>
                    </Stack>
                
                    {isTrifectaFormation ? (
                      <>
                        <Alert severity="info" sx={{ py: 0.5 }}>
                          3連単フォーメーション：1着・2着・3着を選択すると、同一馬の重複を除いて点数を計算します。
                        </Alert>
                
                        <HorseNumberSelector
                          title="1着"
                          selectedNumbers={template.formationFirstNumbers}
                          onToggle={handleToggleFormationFirstNumber}
                        />
                
                        <HorseNumberSelector
                          title="2着"
                          selectedNumbers={template.formationSecondNumbers}
                          onToggle={handleToggleFormationSecondNumber}
                        />
                
                        <HorseNumberSelector
                          title="3着"
                          selectedNumbers={template.formationThirdNumbers}
                          onToggle={handleToggleFormationThirdNumber}
                        />
                      </>
                    ) : isTrioFormation ? (
                      <>
                        <Alert severity="info" sx={{ py: 0.5 }}>
                          3連複フォーメーション：各列から1頭ずつ選び、同じ3頭の組み合わせは重複カウントしません。
                        </Alert>
                
                        <HorseNumberSelector
                          title="1列目"
                          selectedNumbers={template.formationFirstNumbers}
                          onToggle={handleToggleFormationFirstNumber}
                        />
                
                        <HorseNumberSelector
                          title="2列目"
                          selectedNumbers={template.formationSecondNumbers}
                          onToggle={handleToggleFormationSecondNumber}
                        />
                
                        <HorseNumberSelector
                          title="3列目"
                          selectedNumbers={template.formationThirdNumbers}
                          onToggle={handleToggleFormationThirdNumber}
                        />
                      </>
                    ) : isNagashi ? (
                      <>
                        <Alert severity="info" sx={{ py: 0.5 }}>
                          {template.ticketType}流し：軸馬 × 相手馬で点数を自動計算します。
                        </Alert>
                
                        <HorseNumberSelector
                          title="軸馬"
                          selectedNumbers={template.axisHorseNumbers}
                          onToggle={handleToggleAxisHorseNumber}
                        />
                
                        <HorseNumberSelector
                          title="相手馬"
                          selectedNumbers={template.opponentHorseNumbers}
                          onToggle={handleToggleOpponentHorseNumber}
                        />
                      </>
                    ) : template.betStyle === "軸1頭" ||
                      template.betStyle === "軸2頭" ||
                      template.betStyle === "流し" ? (
                      <>
                        <HorseNumberSelector
                          title="軸馬"
                          selectedNumbers={template.axisHorseNumbers}
                          onToggle={handleToggleAxisHorseNumber}
                        />
                
                        <HorseNumberSelector
                          title="相手馬"
                          selectedNumbers={template.opponentHorseNumbers}
                          onToggle={handleToggleOpponentHorseNumber}
                        />
                      </>
                    ) : (
                      <HorseNumberSelector
                        title={
                          template.betStyle === "ボックス"
                            ? "ボックス対象馬"
                            : "買い目対象馬"
                        }
                        selectedNumbers={template.selectedHorseNumbers}
                        onToggle={handleToggleHorseNumber}
                      />
                    )}
                
                    <Alert severity="success" sx={{ py: 0.5 }}>
                      自動計算：{template.pointCount}点 / 合計{" "}
                      {totalAmount.toLocaleString()}円
                    </Alert>
                  </Stack>
                </Paper>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    label="点数"
                    type="number"
                    value={template.pointCount}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        pointCount: Math.max(0, Number(e.target.value || 0)),
                      }))
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />

                  <TextField
                    label="1点あたり推奨金額"
                    type="number"
                    value={template.amountPerPoint}
                    onChange={(e) =>
                      handleChangeTemplate(
                        "amountPerPoint",
                        Math.max(0, Number(e.target.value || 0))
                      )
                    }
                    fullWidth
                    inputProps={{ min: 0, step: 100 }}
                  />

                  <TextField
                    label="合計金額"
                    value={`${totalAmount.toLocaleString()}円`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </Stack>

                <TextField
                  label="補足メモ"
                  value={template.memo}
                  onChange={(e) =>
                    handleChangeTemplate("memo", e.target.value)
                  }
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="例）堅めの決着想定。相手は内枠を厚めに評価。"
                />

                <Divider />

                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    自動生成プレビュー
                  </Typography>

                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: "#fafafa",
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      fontSize: 13,
                    }}
                  >
                    {buildPredictionBody(template)}
                  </Paper>
                </Box>

                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={`${template.pointCount}点`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`合計 ${totalAmount.toLocaleString()}円`}
                      color="success"
                      variant="outlined"
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={applyTemplateToProduct}
                  >
                    本文に反映
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <ProductBasicForm value={form} onChange={setForm} />

            <Stack direction="row" justifyContent="flex-end" mt={4}>
              <Button variant="contained" size="large" onClick={handleSubmit}>
                保存
              </Button>
            </Stack>
          </>
        }
      />
    </Box>
  );
};

type HorseNumberSelectorProps = {
  title: string;
  selectedNumbers: number[];
  onToggle: (number: number) => void;
};

const HorseNumberSelector = ({
  title,
  selectedNumbers,
  onToggle,
}: HorseNumberSelectorProps) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={800} mb={1}>
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 1,
        }}
      >
        {horseNumberOptions.map((number) => {
          const selected = selectedNumbers.includes(number);

          return (
            <Button
              key={number}
              variant={selected ? "contained" : "outlined"}
              color={selected ? "success" : "inherit"}
              onClick={() => onToggle(number)}
              sx={{
                minWidth: 0,
                height: 42,
                fontWeight: 900,
                borderRadius: 2,
              }}
            >
              {number}
            </Button>
          );
        })}
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
        {selectedNumbers.length === 0 ? (
          <Chip label="未選択" size="small" />
        ) : (
          selectedNumbers.map((number) => (
            <Chip
              key={number}
              label={`${number}番`}
              size="small"
              color="success"
              variant="outlined"
            />
          ))
        )}
      </Stack>
    </Box>
  );
};

export default ProductCreatePage;
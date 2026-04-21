import { Box, Button, Typography, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductEditorLayout from "./components/ProductEditorLayout";
import ProductStatusBanner from "./components/ProductStatusBanner";
import ProductBasicForm from "./components/ProductBasicForm";
import { createProduct } from "@api/products";
import { ProductForm } from "@/types/product";

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
        form.is_sold_out && form.sold_out_after
          ? form.sold_out_after
          : null,

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

export default ProductCreatePage;
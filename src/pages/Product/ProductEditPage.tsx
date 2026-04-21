import { Box, Button, Typography, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductEditorLayout from "./components/ProductEditorLayout";
import ProductStatusBanner from "./components/ProductStatusBanner";
import ProductBasicForm from "./components/ProductBasicForm";
import { fetchProducts, updateProduct } from "@api/products";
import { ProductForm } from "@/types/product";

const ProductEditPage = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetchProducts().then((list) => {
      const p = list.find((v) => v.id === Number(id));
      if (!p) return;

      setForm({
        name: p.name ?? "",
        price: p.price ?? 0,
        description: p.description ?? "",
        body: p.body ?? "",
        is_active: p.is_active ?? true,
        publish_from: p.publish_start_at ? String(p.publish_start_at).slice(0, 10) : "",
        publish_to: p.publish_end_at ? String(p.publish_end_at).slice(0, 10) : "",
        is_sold_out: p.sold_out ?? false,
        sold_out_after: p.sold_out_at ? String(p.sold_out_at).slice(0, 10) : "",
      });
    });
  }, [id]);

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
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

    await updateProduct(Number(id), payload as any);
    navigate("/products");
  };

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        無料予想 編集
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
                更新
              </Button>
            </Stack>
          </>
        }
      />
    </Box>
  );
};

export default ProductEditPage;
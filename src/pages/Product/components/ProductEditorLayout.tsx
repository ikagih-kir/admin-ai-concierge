import { Box } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
};

const ProductEditorLayout = ({ left, right }: Props) => {
  return (
    <Box
      display="flex"
      gap={3}
      alignItems="flex-start"
    >
      {/* 左：固定バナー */}
      <Box
        width={280}
        position="sticky"
        top={80} // ← Header 高さ分
        flexShrink={0}
      >
        {left}
      </Box>

      {/* 右：スクロールするフォーム */}
      <Box flex={1}>
        {right}
      </Box>
    </Box>
  );
};

export default ProductEditorLayout;

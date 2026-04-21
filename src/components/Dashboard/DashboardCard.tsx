import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  disabled?: boolean;
};

const DashboardCard = ({
  title,
  description,
  icon,
  to,
  disabled = false,
}: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    navigate(to);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: "100%",
        minHeight: 140,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "0.2s",
        "&:hover": {
          boxShadow: disabled ? undefined : 4,
          transform: disabled ? undefined : "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Box mb={1.5}>{icon}</Box>

        <Typography variant="h6" mb={0.5}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        {disabled && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            準備中
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
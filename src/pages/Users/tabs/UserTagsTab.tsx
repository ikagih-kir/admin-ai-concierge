import { useEffect, useState } from "react";
import { fetchUserTags } from "../../../api/userDetail";
import { Box, Chip } from "@mui/material";

type Props = {
  userId: number;
};

const UserTagsTab = ({ userId }: Props) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchUserTags(userId).then(setTags);
  }, [userId]);

  return (
    <Box display="flex" gap={1} flexWrap="wrap">
      {tags.map((tag) => (
        <Chip key={tag} label={tag} />
      ))}
    </Box>
  );
};

export default UserTagsTab;

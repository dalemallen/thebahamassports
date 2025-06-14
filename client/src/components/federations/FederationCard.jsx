import { Card, CardContent, Typography, Avatar } from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';

const FederationCard = ({ name, imageUrl }) => {
  const hasImage = imageUrl && imageUrl.trim() !== "";

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={hasImage ? imageUrl : undefined}
          sx={{ width: 64, height: 64, bgcolor: !hasImage ? 'primary.main' : 'transparent' }}
        >
          {!hasImage && <EmojiFlagsIcon />}
        </Avatar>

        <Typography variant="h6" sx={{ ml: 2 }}>
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FederationCard;

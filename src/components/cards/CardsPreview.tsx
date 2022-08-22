import { Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material"
import { Recipe } from "../../types"

export type CardPreviewProps = {
    recipe: Recipe
}

const CardPreview: React.FunctionComponent<CardPreviewProps> = ({ recipe }: CardPreviewProps) => {
    return <Card sx={{ maxWidth: 200, margin: 'auto', padding: 0 }}>
        <CardMedia
        component="img"
        height="140"
        image={recipe.picture !== ''? recipe.picture : 'images/no-pictures.png'}
        alt="Image for the recipe"
        />
        <CardContent>
            <Typography align='center' variant='h6'>{recipe.name}</Typography>
            <Typography align='center' noWrap variant='body2'>{recipe.description}</Typography>
        </CardContent>
    </Card>
}

export default CardPreview
import { Typography } from "@mui/material"
import { Recipe } from "../../types"
import FlexCol from "../layout/FlexCol"
import ErrorDisplay from "../queryUtils/ErrorText"
import Loader from "../queryUtils/Loader"

type ListViewProps = {
    name: string
    recipes: Recipe[]
    isLoading: boolean
    isError: boolean
    error: string
}

const ListView: React.FunctionComponent<ListViewProps> = ({ name, recipes, isLoading, isError, error }: ListViewProps) => {
    return <FlexCol>
        <Typography>{name}</Typography>
        {isLoading && <Loader />}
        {isError && <ErrorDisplay text={error} />}
    </FlexCol>
}

export default ListView
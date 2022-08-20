import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

export const CopyRight = (props: any) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            { 'CopyRight ©'}
            <Link color="inherit" href="https://gitlab.com/KayserS">
            Gonzalo's Repo
            </Link>
            { new Date().getFullYear() }
        </Typography>
    )
}
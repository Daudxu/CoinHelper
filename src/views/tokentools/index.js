import React, { PureComponent } from 'react';
// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {Link} from 'react-router-dom'
import { HomeWrapper } from './style'

const hotList = [
    {id:1, name: "Batch Airdrop", desc:" One-to-many batches, convenient and fast, saving time and effort", link: "tokentools/airdrop"},
    {id:2, name: "Batch Gather", desc:" Many-to-one batch collection", link: "tokentools/gather"},
    {id:3, name: "Wallet Approve Scan", desc:" Check which contracts the wallet address has authorized", link: "approve-scan"},
    {id:4, name: "Token Approve", desc:"fast token approve", link: "tokentools/token-approve"},
    {id:5, name: "Token balance query", desc:"fast query Token balance", link: "tokentools/token-balance-query"}
]

class Home extends PureComponent {
    render() {
        return (
            <HomeWrapper>
                <Container>
                    <Box sx={{ margin:'0  auto',  width:'90%', display: 'flex', flexWrap: 'wrap',justifyContent: 'center'}} > 
                        {hotList.map((item, key) => (
                        <Card sx={{  width: 300, height: '200px'}} className="cl-card" key={key}>
                            <CardContent>
                                <Typography variant="h5" component="div" className='cl-card-name'>
                                {item.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                </Typography>
                                <Typography variant="body2" className='cl-desc'>
                                {item.desc}
                                </Typography>
                            </CardContent>
                            <CardActions>
                            <Link to={`/${item.link}`}>   <Button size="small">Learn More </Button>  </Link>
                            </CardActions>
                        </Card>
                        ))}
                    </Box>
                </Container>
            </HomeWrapper>
        )
    }
    
}

export default Home;

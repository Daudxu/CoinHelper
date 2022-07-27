import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
import { MainWrapper, CurveMain} from './style'
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { curve as curveRow } from  "../../config/settings.js"

class Curve extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
       console.log('handleClick')
    }
    
    render() {
        return (
            <MainWrapper>
              <CurveMain>
                {curveRow.map((item, key) => (
                <Card sx={{ maxWidth: 275 }} className="cl-card"  key={key}>
                  <CardContent>
                    <Typography variant="body2">
                    {item.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                  <Link to={`/curve/${item.name}`}>   <Button size="small">view </Button>  </Link>
                  </CardActions>
                </Card>
                ))}
              </CurveMain>
            </MainWrapper>
        )
    }
}

export default Curve;

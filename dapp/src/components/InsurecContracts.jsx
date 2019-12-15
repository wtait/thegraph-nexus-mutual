import React from 'react'
import {
  Typography,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel
} from '@material-ui/core'

const styles = makeStyles(({
  actionArea: {
    width: 300,
  },
  content: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  table: {
    minWidth: 700,
  },
  title: {
    marginBottom: 30,
    display: 'inline-block',
  }
}));

function SortedHeader({ order, setOrder, fn, label, align }) {
  const handler = _event => {
    const isDesc = order.label === label && order.direction === 'desc';
    setOrder({
      label,
      direction: isDesc ? 'asc' : 'desc',
      fn
    });
  };
  return (
    <TableCell align={align}>
      <TableSortLabel
        active={order.label === label}
        direction={order.direction}
        onClick={handler}
      >
        { label }
      </TableSortLabel>
    </TableCell>
  );
}

function sumAmounts(items) {
  return items.reduce((agg, i) => agg + parseFloat(i.amount), 0);
}

export default function InsuredContracts({ contracts }) {
  const classes = styles();
  const [order, setOrder] = React.useState({
    label: 'id',
    direction: 'asc',
    fn: c => c.id
  });

  const sortedContracts = contracts.sort((a, b) => {
    if (order.direction === 'asc') {
      return order.fn(a) > order.fn(b) ? 1 : -1;
    }
    return order.fn(a) < order.fn(b) ? 1 : -1;
  })

  return (
    <div className={classes.table}>
      <Typography variant="title" className={classes.title}>
        Nexus Mutual dApp ({contracts.length} Insured Contracts!)
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <SortedHeader fn={c => c.id} label="id" order={order} setOrder={setOrder} />
              <SortedHeader fn={c => c.ens} label="ENS" order={order} setOrder={setOrder} />
              <SortedHeader fn={c => c.stakes.length} label="Stake Count" order={order} setOrder={setOrder} align='right' />
              <SortedHeader
                fn={c => sumAmounts(c.stakes)}
                label="NXM Staked"
                order={order}
                setOrder={setOrder}
                align='right' />
              <SortedHeader fn={c => c.covers.length} label="Cover Count" order={order} setOrder={setOrder} align='right' />
              <SortedHeader
                fn={c => sumAmounts(c.covers)}
                label="ETH Covered"
                order={order}
                setOrder={setOrder}
                align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContracts.map(({ id, ens, covers, stakes }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">{id}</TableCell>
                <TableCell>{ens}</TableCell>
                <TableCell align="right">{stakes.length}</TableCell>
                <TableCell align="right">{sumAmounts(stakes)}</TableCell>
                <TableCell align="right">{covers.length}</TableCell>
                <TableCell align="right">{sumAmounts(covers)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

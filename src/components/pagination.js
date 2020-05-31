import React from 'react';
import { Pagination } from 'react-bootstrap';

class PaginationLinks extends React.Component {
    render() {
        let current = this.props.current, total = this.props.total, items = [], number, pagenum, lnk;
        if (current === 1) {
            items.push(<Pagination.First key="First" disabled />);
            items.push(<Pagination.Prev key="Prev" disabled />);
        } else {
            items.push(<Pagination.First key="First" href={'/'} />);
            pagenum = current - 1;
            if (pagenum === 1) {
                items.push(<Pagination.Prev key="Prev" href={'/'} />);
            } else {
                items.push(<Pagination.Prev key="Prev" href={'/page/' + pagenum} />);
            }
        }
        for (number = 1; number <= total; number++) {
            lnk = number === 1 ? '/' : '/page/' + number;
            items.push(
                <Pagination.Item key={number} active={number === current} href={lnk}>
                    {number}
                </Pagination.Item>,
            );
        }
        if (current === total) {
            items.push(<Pagination.Next key="Next" disabled />);
            items.push(<Pagination.Last key="Last" disabled />);
        } else {
            items.push(<Pagination.Next key="Next" href={'/page/' + (current + 1)} />);
            items.push(<Pagination.Last key="Last" href={'/page/' + total} />);
        }
        return (
            <Pagination>
                {items}
            </Pagination>
        );
    }
};

export default PaginationLinks
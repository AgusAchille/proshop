import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

export default function Paginate({ pages, page, baseUrl = ''}) {
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map( x => (
                <LinkContainer key={x + 1} to={x + 1 !== page && `${baseUrl}/page/${x + 1}`}>
                    <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )
}
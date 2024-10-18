export interface BooksData {
    id: number
    code: string
    title: string
    author: string
    stock: number
}

export interface MembersData {
    id : number
    code : string
    name : string,
    borrowed_book : string
}

export interface BorrowedData {
    id: number,
    code: string,
    title: string,
    author: string,
    name: string,
    borrow_date : string
    isreturn : string
    return_date : string
    total_days : string
}
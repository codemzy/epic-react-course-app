import {formatDate} from '../misc'

// exercise - test formatDate function
test('formatDate formats the date to look nice', () => {
    expect(formatDate(new Date('December 16, 2020'))).toBe('Dec 20');
});



import { render, screen } from '@testing-library/react';
import App from '../reactapp/App';

test('renders learn react link', () => {
render(<App />);
const textExist = screen.getByText(/TEST/i);
expect(textExist).toBeInTheDocument();
});

// test('render d`une <div />', () => {  // test 14
//     const container = shallow(<Provider />);
//     expect(container.find('div').length).toEqual(1);
// });


import MobileView from '../MobileView/MobileView';
import { cleanup, render, screen } from '@testing-library/react';
import { store } from '../../store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

afterEach(() => {
    cleanup();
});

test('renders MobileView component', () => {
    render(<Provider store={store}>
        <MobileView />
    </Provider>);
    const chatWindow = screen.getByTestId('test-ChatWindow');
    const chatOption = screen.getByTestId('test-ChatOption');
    const userList = screen.getByTestId('test-UserList');
    const messageBox = screen.getByTestId('test-MessageBox');
    expect(chatWindow).toBeInTheDocument();
    expect(chatOption).toBeInTheDocument();
    expect(userList).toBeInTheDocument();
    expect(messageBox).toBeInTheDocument();
});

test('opens and closes UserList', () => {
    render(<Provider store={store}>
        <MobileView />
    </Provider>);
    const userList = screen.getByTestId('test-UserList');
    expect(userList).toBeInTheDocument();
    const button = screen.getByText('Chats');
    expect(button).toBeInTheDocument();
    act(() => {
        button.click();
    });
    const closeButton = screen.getByTestId('test-MobileCloseButton');
    expect(closeButton).toBeInTheDocument();
    act(() => {
        closeButton.click();
    }
    );
}
)
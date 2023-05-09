import User from "../User";
import { act, cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import { setActiveChat } from "../../features/chats/chatsSlice";

afterEach(() => {
    cleanup();
});

describe("User", () => {
    it("should render User", () => {
        const user = {
            user: {
                _id: "1",
                nick: "test",
            },
        };
        render(
            <Provider store={store}>
                <User {...user} />
            </Provider>
        );
        const userElement = screen.getByText(/test/i);
        expect(userElement).toBeInTheDocument();
    });

    it("should render User with active class", () => {
        const user = {
            user: {
                _id: "1",
                nick: "test",
            },
        };
        render(
            <Provider store={store}>
                <User {...user} />
            </Provider>
        );
        const userElement = screen.getByText(/test/i);
        expect(userElement).toHaveClass("shapeActive");
    });

    it("should render User with inactive shape", () => {
        const user = {
            user: {
                _id: "3",
                nick: "test2",
            },
        };

        render(
            <Provider store={store}>
                <User {...user} />
            </Provider>
        );

        const inactiveUserElement = screen.getByText(/test2/i);
        expect(inactiveUserElement).toHaveClass("shape");

        act(() => { store.dispatch(setActiveChat({ chatID: '1', chatName: 'x', members: ["1", "3"] })) });
        const activeUserElement = screen.getByText(/test2/i);
        expect(activeUserElement).toHaveClass("shapeActive");
    });

    it("should correctly read the active chat state from Redux and display the correct shape class", () => {
        const user = {
            user: {
                _id: "2",
                nick: "test2",
            },
        };
        store.dispatch(setActiveChat({ chatID: "2", chatName: "1", members: ["1", "3"] }));
        render(
            <Provider store={store}>
                <User {...user} />
            </Provider>
        );
        const userElement = screen.getByText(/test2/i);
        expect(userElement).toHaveClass("shape");
    });
});




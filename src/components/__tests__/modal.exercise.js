import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// 🐨 you're gonna need this stuff:
import {Modal, ModalContents, ModalOpenButton} from '../modal';

test('can be opened and closed', function() {
    const label = 'Modal Label'
    const title = 'Modal Title'
    const content = 'Modal content'
    // 🐨 render the Modal, ModalOpenButton, and ModalContents
    // 🐨 click the open button
    // 🐨 verify the modal contains the modal contents, title, and label
    // 🐨 click the close button
    // 🐨 verify the modal is no longer rendered
    // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
    render(
        <Modal>
            <ModalOpenButton><button>Open</button></ModalOpenButton>
            <ModalContents aria-label={label} title={title}>
                <div>{content}</div>
            </ModalContents>
        </Modal>
    );
    const openButton = screen.getByRole('button', {name: /open/i})
    // screen.debug();
    // show the modal
    userEvent.click(openButton)
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-label', label);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
    // screen.debug();
    // close the modal
    const closeButton = screen.getByRole('button', {name: /close/i})
    userEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // modal no longer in document
})
// This file contains functions for managing groups on the frontend, including adding, editing, and deleting groups, as well as displaying them in the UI.

document.addEventListener('DOMContentLoaded', () => {
    const groupForm = document.getElementById('groupForm');
    const groupList = document.getElementById('groupList');

    groupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const groupName = document.getElementById('groupName').value;
        await addGroup(groupName);
        groupForm.reset();
        loadGroups();
    });

    async function loadGroups() {
        const response = await fetch('/api/groups');
        const groups = await response.json();
        groupList.innerHTML = '';
        groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = group.name;
            li.appendChild(createEditButton(group));
            li.appendChild(createDeleteButton(group.id));
            groupList.appendChild(li);
        });
    }

    async function addGroup(name) {
        await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
    }

    function createEditButton(group) {
        const button = document.createElement('button');
        button.textContent = 'Edit';
        button.addEventListener('click', () => editGroup(group));
        return button;
    }

    function createDeleteButton(groupId) {
        const button = document.createElement('button');
        button.textContent = 'Delete';
        button.addEventListener('click', () => deleteGroup(groupId));
        return button;
    }

    async function editGroup(group) {
        const newName = prompt('Enter new group name:', group.name);
        if (newName) {
            await fetch(`/api/groups/${group.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName })
            });
            loadGroups();
        }
    }

    async function deleteGroup(groupId) {
        if (confirm('Are you sure you want to delete this group?')) {
            await fetch(`/api/groups/${groupId}`, {
                method: 'DELETE'
            });
            loadGroups();
        }
    }

    loadGroups();
});
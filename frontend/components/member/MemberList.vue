<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-gray-700 text-xl font-semibold mb-4">User List</h2>

        <!-- User List -->
        <div class="overflow-x-auto">
            <div class="min-w-full bg-white rounded-lg shadow overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-200 p-4 text-gray-700 font-semibold">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Description</div>
                    <div>Actions</div>
                </div>

                <div class="divide-y divide-gray-200">
                    <!-- User Row -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                        <div class="font-medium text-gray-900">John Doe</div>
                        <div class="text-gray-600">john.doe@example.com</div>
                        <div class="text-gray-600">Regular user</div>
                        <div class="flex space-x-2">
                            <button
                                class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                Revoke
                            </button>
                            <button
                                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                Delete
                            </button>
                        </div>
                    </div>
                    <!-- Repeat User Row for more users -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                        <div class="font-medium text-gray-900">Jane Smith</div>
                        <div class="text-gray-600">jane.smith@example.com</div>
                        <div class="text-gray-600">Admin user</div>
                        <div class="flex space-x-2">
                            <button
                                class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                Revoke
                            </button>
                            <button
                                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                Delete
                            </button>
                        </div>
                    </div>
                    <!-- Add more user rows as needed -->
                </div>
            </div>
        </div>
    </div>
</template>

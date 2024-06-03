<template>
    <section class="w-full mt-6">
        <div class="w-full max-w-lg mx-auto mt-6 flex justify-between items-center">
            <div class="w-1/3">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="search">
                    Search
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="search" type="text" placeholder="Search tasks">
            </div>
            <div class="w-1/3">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="filter">
                    Filter
                </label>
                <select
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="filter">
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <div class="w-1/3">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="sort">
                    Sort By
                </label>
                <select
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="sort">
                    <option value="name">Name</option>
                    <option value="due-date">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="member">Member</option>
                </select>
            </div>
        </div>
        <div class="w-full mt-2">
            <div class="bg-blue-500 text-white px-4 py-2 mb-2">Tasks</div>
            <div class="bg-white shadow-lg rounded-lg px-4 py-2 mb-4">
                <div class="flex justify-between items-center border-b-2 border-gray-200 py-2">
                    <div class="w-full md:w-1/5 font-bold text-black">Task</div>
                    <div class="w-full md:w-1/5 font-bold text-black">Due Date</div>
                    <div class="w-full md:w-1/5 font-bold text-black">Priority</div>
                    <div class="w-full md:w-1/5 font-bold text-black">Member</div>
                    <div class="w-full md:w-1/5 font-bold text-black">Actions</div>
                </div>
                <div class="flex flex-col md:flex-row justify-between items-center py-2">
                    <div class="w-full md:w-1/5 text-black">Task 1</div>
                    <div class="w-full md:w-1/5 text-black">2022-12-31</div>
                    <div class="w-full md:w-1/5 text-black">High</div>
                    <div class="w-full md:w-1/5 text-black">Member 1</div>
                    <div class="flex md:w-1/5 justify-end mt-4 md:mt-0">
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2">
                            Delete
                        </button>
                        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                            Change Status
                        </button>
                    </div>
                </div>
                <!-- Repeat for other tasks -->
            </div>
        </div>
    </section>
</template>

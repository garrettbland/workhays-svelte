<script lang="ts">
	import type { PageData } from './$types';
	let { job }: { job: PageData } = $props();
</script>

<div class="lg:flex lg:items-center lg:justify-between">
	<div class="">
		<h2 class="m-0 mt-8 text-2xl font-bold sm:truncate">Retail Sales Associate</h2>
		<div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
			<div class="mt-2 flex items-center text-sm font-medium text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mr-1.5 size-5 shrink-0 text-gray-500"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
					/>
				</svg>
				Full-time
			</div>
			<div class="mt-2 flex items-center text-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mr-1.5 size-5 shrink-0 text-gray-500"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
				<a class="text-blue-800 no-underline hover:underline" href="#">Apply Online</a>
			</div>
			<div class="mt-2 flex items-center text-sm text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mr-1.5 size-5 shrink-0 text-gray-500"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
					/>
				</svg>
				<a class=" text-blue-800 no-underline hover:underline" href="mailto:email@example.com"
					>Contact</a
				>
			</div>
			<div class="mt-2 flex items-center text-sm font-medium text-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="mr-1.5 size-5 shrink-0 text-gray-500"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
					/>
				</svg>
				<a class=" text-blue-800 no-underline hover:underline" href="tel:555-555-5555"
					>555-555-5555</a
				>
			</div>
			<div class="mt-2 flex items-center text-sm font-medium text-gray-700">
				<svg
					class="-ml-0.5 mr-1.5 size-5 text-gray-400"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
					/>
					<path
						d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"
					/>
				</svg>
				<a class=" text-blue-800 no-underline hover:underline" href="tel:555-555-5555">Copy Link</a>
			</div>
		</div>
	</div>
	<div class="mt-5 flex hidden lg:ml-4 lg:mt-0">
		<span class="ml-0 lg:ml-3">
			<button
				type="button"
				class="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				<svg
					class="-ml-0.5 mr-1.5 size-5 text-gray-400"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
					/>
					<path
						d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"
					/>
				</svg>
				Copy Link
			</button>
		</span>
	</div>
</div>
<div class="mx-auto my-8 max-w-4xl lg:px-0">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-6">
		<div class="col-span-1 mb-12 md:col-span-4 md:mb-0 md:pr-4">
			<div class="text-sm font-bold">Description</div>
			<div id="description_input_trix" class="leading-7 text-gray-900 antialiased">
				<div>
					Looking for <em>Something Different</em>?&nbsp; At Nex-Tech Wireless, we’re always working
					to bring the latest technology to the communities we serve.&nbsp; Join our hometown team
					as a <strong>Retail Sales Associate</strong> and have the opportunity to earn over $16.00
					per hour including commissions!&nbsp; Let’s talk about how you can work 4 days a week
					while being paid for 5!&nbsp;<br /><br />
				</div>
				<div>We are seeking customer-oriented candidates to:<br />&nbsp;</div>
				<ul>
					<li>Promote and sell Nex-Tech Wireless products and services</li>
					<li>Build and maintain relationships with new and existing customers</li>
					<li>Educate customers on wireless products, services, and promotions</li>
					<li>Build relationships through community engagement</li>
					<li>
						Resolve product and service issues and determine customer needs and best solutions
					</li>
					<li>Conduct follow-up calls to ensure continued customer satisfaction</li>
				</ul>
				<div>&nbsp;</div>
				<div>Required Skills and Qualifications:<br />&nbsp;</div>
				<ul>
					<li>One year of customer service, telephone sales, or equivalent work experience</li>
					<li>High School Diploma or equivalent</li>
					<li>Customer-focused attitude</li>
					<li>Ability to organize and handle multiple tasks</li>
					<li>Strong communication and problem-solving skills</li>
					<li>Availability to work evenings, weekends, and some holidays</li>
				</ul>
				<div>&nbsp;</div>
				<div>We proudly offer:</div>
				<div>&nbsp;</div>
				<ul>
					<li>Competitive pay and opportunity for monthly commission</li>
					<li>A fun work environment</li>
					<li>401(k) Retirement Plan with Company Match</li>
					<li>Health, Dental, and Vision Insurance</li>
					<li>Life, Dependent Life, and AD&amp;D Insurance&nbsp;</li>
					<li>Short and Long-term Disability Insurance</li>
					<li>Generous Paid Time Off</li>
					<li>Employee Discounts&nbsp;</li>
				</ul>
				<div>
					<br />How to apply:&nbsp; Submit an online application at
					<a href="https://www.nex-techwireless.com/job-application"
						>https://www.nex-techwireless.com/job-application</a
					>
					and send a current resume and cover letter to
					<a href="mailto:ntwcareers@ntwls.com">ntwcareers@ntwls.com</a>.&nbsp; Nex-Tech Wireless is
					an EEO employer.
				</div>
			</div>
		</div>
		<div class="col-span-1 md:col-span-2">
			<div class="rounded-lg border border-gray-200 bg-white p-2">
				<div class="mb-6">
					<div class="text-sm font-bold">Employer</div>
					<div class="mt-1 text-sm text-gray-900">
						<a class="text-blue-800 no-underline hover:underline" href="#">
							Nex-Tech Wireless, LLC
						</a>
					</div>
				</div>
				<div class="mb-6">
					<div class="text-sm font-bold">Employer Contact</div>
					<div class="mt-1 text-sm text-gray-900">Lisa Pierce</div>
				</div>
				<div class="mb-6">
					<div class="text-sm font-bold">Created On</div>
					<div class="mt-1 text-sm text-gray-900">Jul 7, 2020</div>
				</div>
				<div class="">
					<div class="text-sm font-bold">Last Updated</div>
					<div class="mt-1 text-sm leading-5 text-gray-900">Dec 30, 2024</div>
				</div>
			</div>
		</div>
	</div>
</div>

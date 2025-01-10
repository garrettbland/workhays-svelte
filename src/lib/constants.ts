export const SITE_NAME = 'Work Hays'

export const NAV_LINKS = [
	{
		name: 'Jobs',
		href: '/'
	},
	{
		name: 'Events',
		href: '/events'
	},
	{
		name: 'Contact',
		href: '/contact'
	}
]

export const FOOTER_LINKS = [
	{
		name: 'Privacy Policy',
		href: '/privacy'
	},
	{
		name: 'Terms of Service',
		href: '/terms'
	},
	{
		name: `FAQ's`,
		href: '/faq'
	},
	{
		name: 'Help',
		href: '/help'
	},
	{
		name: 'About',
		href: '/about'
	}
]

export const ADMIN_NAV_LINKS = [
	{
		name: 'Dashboard',
		href: '/admin/dashboard'
	},
	{
		name: 'Jobs',
		href: '/admin/jobs'
	},
	{
		name: 'Settings',
		href: '/admin/settings'
	},
	{
		name: 'Account',
		href: '/admin/account'
	}
]

export const INDUSTRIES_LIST = [
	{
		name: 'All Industries',
		value: ''
	},
	{
		name: 'Accounting / Finance/ Banking',
		value: ''
	},
	{
		name: 'Administrative / Office Support',
		value: ''
	},
	{
		name: 'Agriculture',
		value: ''
	},
	{
		name: 'Construction / Natural Gas / Oil',
		value: ''
	},
	{
		name: 'Delivery / Transportation / Trucking',
		value: ''
	},
	{
		name: 'Education',
		value: ''
	},
	{
		name: 'Food Service',
		value: ''
	},
	{
		name: 'Healthcare / Social Assistance',
		value: ''
	},
	{
		name: 'Hotel / Hospitality',
		value: ''
	},
	{
		name: 'IT / Computer',
		value: ''
	},
	{
		name: 'Maintenance / Custodial',
		value: ''
	},
	{
		name: 'Manufacturing / Assembly',
		value: ''
	},
	{
		name: 'Professional Services',
		value: ''
	},
	{
		name: 'Real Estate / Rental',
		value: ''
	},
	{
		name: 'Retail / Sales',
		value: ''
	},
	{
		name: 'Uncategorized', // Here for migration
		value: 'uncategorized'
	}
]

export const INDUSTRY_LIST_VALUES = INDUSTRIES_LIST.map((industry) => industry.value)

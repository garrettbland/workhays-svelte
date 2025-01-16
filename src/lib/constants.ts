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

export enum INDUSTRIES {
	'Accounting / Finance / Banking' = 'accounting-finance-banking',
	'Administrative / Office Support' = 'administrative-officesupport',
	'Agriculture' = 'agriculture',
	'Construction / Natural Gas / Oil' = 'construction-naturalgas-oil',
	'Delivery / Transportation / Trucking' = 'delivery-transportation-trucking',
	'Education' = 'education',
	'Food Service' = 'foodservice',
	'Healthcare / Social Assistance' = 'healthcare-socialassistance',
	'Hotel / Hospitality' = 'hotel-hospitality',
	'IT / Computer' = 'it-computer',
	'Maintenance / Custodial' = 'maintenance-custodial',
	'Manufacturing / Assembly' = 'manufacturing-assembly',
	'Professional Services' = 'professionalservices',
	'Real Estate / Rental' = 'realestate-rental',
	'Retail / Sales' = 'retail-sales',
	'Uncategorized' = 'uncategorized' // used for migration to replace "all industries"
}

export enum JOB_TYPES {
	'Full Time' = 'FULL_TIME',
	'Part Time' = 'PART_TIME',
	'Contract' = 'CONTRACT',
	'Temporary/Seasonal' = 'TEMPORARY',
	'Intern' = 'INTERN'
}

export enum JOB_STATUSES {
	'Draft' = 'DRAFT',
	'Published' = 'PUBLISHED',
	'Archived' = 'ARCHIVED'
}

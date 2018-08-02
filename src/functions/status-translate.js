export const statuses = [
	{
		id: 5,
		name: 'desk',
	},
	{
		id: 1,
		name: 'working on issue',
	},
	{
		id: 8,
		name: 'working at desk',
	},
	{
		id: 16,
		name: 'mountain pacific',
	},
	{
		id: 17,
		name: 'central',
	},
	{
		id: 18,
		name: 'eastern',
	},
	{
		id: 15,
		name: 'data migration',
	},
	{
		id: 19,
		name: 'dev room',
	},
	{
		id: 20,
		name: 'implementation',
	},
	{
		id: 22,
		name: 'custom mappings',
	},
	{
		id: 3,
		name: 'break',
	},
	{
		id: 2,
		name: 'lunch',
	},
	{
		id: 4,
		name: 'meeting',
	},
	{
		id: 6,
		name: 'out of office',
	},
]

const getStatusName = (id) => (
    statuses.find(status => status.id === id).name
)

export default getStatusName
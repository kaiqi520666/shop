<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 条件搜索 -->
			<cl-search ref="Search" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table"
				><template #column-total="{ scope }">{{
					(scope.row.price * scope.row.num).toFixed(2)
				}}</template></cl-table
			>
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'shop-order'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
const { service, setRefs, refs } = useCool();
const { t } = useI18n();
const options = reactive({
	status: [
		{
			label: t('未支付'),
			value: 0,
			type: 'danger'
		},
		{
			label: t('已支付'),
			value: 1,
			type: 'success'
		}
	]
});
const productColumns = [
	{
		label: '头像',
		prop: 'img',
		component: {
			name: 'cl-avatar'
		}
	},
	{
		label: '标题',
		prop: 'title'
	},
	{
		label: '创建时间',
		prop: 'createTime'
	}
];
const columns = [
	{
		label: '头像',
		prop: 'avatarUrl',
		component: {
			name: 'cl-avatar'
		}
	},
	{
		label: '昵称',
		prop: 'nickName'
	}
];
// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('选择商品'),
			prop: 'productId',
			component: {
				name: 'cl-select-table',
				props: {
					pickerType: 'default',
					multiple: false,
					columns: productColumns,
					service: service.shop.product,
					dict: {
						id: 'id',
						img: 'img',
						text: 'title'
					}
				},
				ref: setRefs('selectProduct')
			},
			required: true
		},
		{
			label: t('选择用户'),
			prop: 'userId',
			component: {
				name: 'cl-select-table',
				props: {
					pickerType: 'default',
					multiple: false,
					columns,
					service: service.user.info,
					dict: {
						id: 'id',
						img: 'avatarUrl',
						text: 'nickName'
					}
				},
				ref: setRefs('selectUser')
			},
			required: true
		},

		{
			label: t('订单状态'),
			prop: 'status',
			value: 0,
			component: {
				name: 'el-radio-group',
				options: options.status
			},
			span: 12,
			required: true
		},
		{
			label: t('订单数量'),
			prop: 'num',
			value: 1,
			component: {
				name: 'el-input-number',
				props: {
					clearable: true,
					min: 1,
					max: 9999999999,

					default: 1
				}
			},
			span: 12,
			required: true
		}
	],
	async onInfo(data, { done, next }) {
		const newData = await next({
			...data
		});

		refs.selectProduct?.set([
			{
				id: data.productId,
				img: data.img,
				title: data.title
			}
		]);
		refs.selectUser?.set([
			{
				id: data.userId,
				avatarUrl: data.avatarUrl,
				nickName: data.nickName
			}
		]);
		done(newData);
	}
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('订单编号'), prop: 'uid', minWidth: 220 },
		{
			label: t('商品缩略图'),
			prop: 'img',
			minWidth: 120,
			component: {
				name: 'cl-avatar'
			}
		},
		{
			label: t('商品标题'),
			showOverflowTooltip: true,
			prop: 'title',
			minWidth: 120
		},
		{
			label: t('下单用户头像'),
			prop: 'avatarUrl',
			minWidth: 120,
			component: {
				name: 'cl-avatar'
			}
		},
		{
			label: t('下单用户'),
			prop: 'nickName',
			minWidth: 120
		},
		{ label: t('订单状态'), prop: 'status', minWidth: 120, dict: options.status },
		{ label: t('订单单价'), prop: 'price', minWidth: 120 },
		{ label: t('订单数量'), prop: 'num', minWidth: 120 },
		{ label: t('订单总额'), prop: 'total', minWidth: 120 },
		{
			label: t('下单时间'),
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			component: { name: 'cl-date-text' }
		},

		{ type: 'op', buttons: ['edit', 'delete'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.shop.order
	},
	app => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>

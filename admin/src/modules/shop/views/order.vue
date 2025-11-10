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
				}}</template
				><template #slot-link="{ scope }">
					<el-button text bg type="success" @click="onCopy(scope.row)"
						>复制链接</el-button
					>
				</template></cl-table
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

import { ElMessage } from 'element-plus';
const { service, setRefs, refs } = useCool();
const { t } = useI18n();

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
		{ label: t('订单编号'), prop: 'uid' },
		{
			label: t('商品缩略图'),
			prop: 'img',

			component: {
				name: 'cl-image'
			}
		},
		{
			label: t('商品标题'),
			showOverflowTooltip: true,
			prop: 'title'
		},
		{
			label: t('下单用户头像'),
			prop: 'avatarUrl',

			component: {
				name: 'cl-avatar'
			}
		},
		{
			label: t('下单用户'),
			prop: 'nickName'
		},
		{ label: t('订单单价'), prop: 'price' },
		{ label: t('订单数量'), prop: 'num' },
		{ label: t('订单总额'), prop: 'total' },
		{
			label: t('下单时间'),
			prop: 'createTime',

			sortable: 'desc',
			component: { name: 'cl-date-text' }
		},
		{ type: 'op', buttons: ['slot-link', 'edit', 'delete'], width: 320 }
	]
});
const onCopy = row => {
	const domain =
		import.meta.env.MODE === 'development'
			? 'http://localhost:5173'
			: 'https://shop.fdshop.top';
	navigator.clipboard.writeText(`${domain}/order/${row.uid}`);
	ElMessage.success('复制成功');
};
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

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
			<cl-table ref="Table" />
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
	name: 'shop-product'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';

const { service } = useCool();
const { t } = useI18n();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('商品标题'),
			prop: 'title',
			component: { name: 'el-input', props: { clearable: true } },
			span: 24,
			required: true
		},
		{
			label: t('商品图片'),
			prop: 'img',
			component: { name: 'cl-upload' },
			span: 12,
			required: true
		},
		{
			label: t('商品价格'),
			prop: 'price',
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					clearable: true,
					min: 0,
					max: 9999999999,
					precision: 2,
					default: 0
				}
			},
			span: 12,
			required: true
		},

		{
			label: t('商品描述'),
			prop: 'desc',
			component: { name: 'cl-editor-wang' },
			span: 24,
			required: true
		},
		{
			label: t('商品库存'),
			prop: 'stock',
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					props: {
						clearable: true,
						min: 0,
						max: 9999999999,

						default: 0
					}
				}
			},
			span: 12,
			required: true
		},
		{
			label: t('商品销量'),
			prop: 'sales',
			value: 0,
			component: {
				name: 'el-input-number',
				props: {
					props: {
						clearable: true,
						min: 0,
						max: 9999999999,

						default: 0
					}
				}
			},
			span: 12,
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('商品编号'), prop: 'uid', minWidth: 120 },
		{
			label: t('商品图片'),
			prop: 'img',
			minWidth: 100,
			component: {
				name: 'cl-avatar'
			}
		},
		{ label: t('商品价格'), prop: 'price', minWidth: 120 },
		{ label: t('商品标题'), prop: 'title', minWidth: 120, showOverflowTooltip: true },
		{ label: t('商品库存'), prop: 'stock', minWidth: 120 },
		{ label: t('商品销量'), prop: 'sales', minWidth: 120 },
		{
			label: t('创建时间'),
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			component: { name: 'cl-date-text' }
		},
		{
			label: t('更新时间'),
			prop: 'updateTime',
			minWidth: 170,
			sortable: 'custom',
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
		service: service.shop.product
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

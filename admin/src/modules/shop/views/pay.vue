<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<cl-flex1 />
			<!-- 条件搜索 -->
			<cl-search ref="Search" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table">
				<template #column-total="{ scope }">{{
					(scope.row.price * scope.row.num).toFixed(2)
				}}</template>
			</cl-table>
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
	name: 'shop-pay'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';

const { service } = useCool();
const { t } = useI18n();
const options = {
	status: [
		{
			label: t('待支付'),
			value: 0,
			type: 'info'
		},
		{
			label: t('支付成功'),
			value: 2,
			type: 'success'
		},
		{
			label: t('支付失败'),
			value: 3,
			type: 'danger'
		}
	]
};

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('唯一标识'),
			prop: 'uid',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('选择关联订单号'),
			prop: 'orderId',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('支付状态'),
			prop: 'status',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('下单IP'),
			prop: 'ip',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ label: t('唯一标识'), prop: 'uid', minWidth: 120 },
		{ label: t('商口名称'), prop: 'title', minWidth: 120, showOverflowTooltip: true },
		{ label: t('商口缩略图'), prop: 'img', minWidth: 120, component: { name: 'cl-image' } },
		{ label: t('主播'), prop: 'nickName', minWidth: 120 },
		{
			label: t('主播头像'),
			prop: 'avatarUrl',
			minWidth: 120,
			component: { name: 'cl-avatar' }
		},
		{
			label: t('价格'),
			prop: 'price',
			minWidth: 120
		},
		{
			label: t('数量'),
			prop: 'num',
			minWidth: 120
		},
		{ label: t('总额'), prop: 'total', minWidth: 120 },
		{
			label: t('下单IP'),
			prop: 'ip',
			minWidth: 120
		},
		{
			label: t('手续费'),
			prop: 'fee',
			minWidth: 120
		},
		{
			label: t('支付状态'),
			prop: 'status',
			minWidth: 120,
			dict: options.status
		},
		{
			label: t('创建时间'),
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			component: { name: 'cl-date-text' }
		}
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.shop.pay
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

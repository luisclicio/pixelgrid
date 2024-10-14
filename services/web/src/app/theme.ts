import { BarChart, LineChart } from '@mantine/charts';
import {
  ActionIcon,
  Badge,
  Card,
  Checkbox,
  Fieldset,
  Grid,
  Menu,
  Modal,
  NavLink,
  Paper,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Tooltip,
  createTheme,
} from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { Spotlight } from '@mantine/spotlight';

export const theme = createTheme({
  defaultRadius: 'md',

  components: {
    Badge: Badge.extend({
      defaultProps: {
        variant: 'light',
      },
    }),

    Paper: Paper.extend({
      defaultProps: {
        withBorder: true,
      },
    }),

    Card: Card.extend({
      defaultProps: {
        p: 'md',
        radius: 'md',
        withBorder: true,
      },
    }),

    Stack: Stack.extend({
      defaultProps: {
        gap: 'md',
      },
    }),

    SimpleGrid: SimpleGrid.extend({
      defaultProps: {
        spacing: 'md',
      },
    }),

    Grid: Grid.extend({
      defaultProps: {
        align: 'stretch',
      },
    }),

    Tooltip: Tooltip.extend({
      defaultProps: {
        position: 'bottom',
        withArrow: true,
      },
    }),

    Menu: Menu.extend({
      defaultProps: {
        shadow: 'md',
      },
    }),

    Popover: Popover.extend({
      defaultProps: {
        shadow: 'md',
        position: 'bottom-end',
      },
    }),

    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        size: 'xl',
        styles: {
          title: {
            fontSize: 'var(--mantine-font-size-lg)',
            fontWeight: 'bold',
          },
        },
      },
    }),

    Spotlight: Spotlight.extend({
      defaultProps: {
        centered: false,
      },
    }),

    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'default',
        size: 'lg',
      },
    }),

    NavLink: NavLink.extend({
      defaultProps: {
        variant: 'light',
        childrenOffset: '2.2rem',
        fz: 'lg',
        lh: 'sm',
      },
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-md)',
        },
      },
    }),

    Select: Select.extend({
      defaultProps: {
        allowDeselect: false,
      },
    }),

    DatePicker: DatePicker.extend({
      defaultProps: {
        type: 'range',
        // @ts-expect-error Boolean value is expected
        allowSingleDateInRange: true,
      },
    }),

    DatePickerInput: DatePickerInput.extend({
      defaultProps: {
        valueFormat: 'DD/MM/YYYY',
        type: 'range',
        // @ts-expect-error Boolean value is expected
        allowSingleDateInRange: true,
      },
    }),

    Checkbox: Checkbox.extend({
      defaultProps: {
        size: 'md',
        labelPosition: 'right',
      },
    }),

    Fieldset: Fieldset.extend({
      defaultProps: {
        p: 'md',
      },
    }),

    BarChart: BarChart.extend({
      defaultProps: {
        h: 300,
        withLegend: true,
        tooltipAnimationDuration: 200,
      },
    }),

    LineChart: LineChart.extend({
      defaultProps: {
        h: 300,
        curveType: 'bump',
        withXAxis: true,
        withLegend: true,
        withDots: false,
        tooltipAnimationDuration: 200,
        legendProps: {
          verticalAlign: 'top',
        },
      },
    }),
  },
});

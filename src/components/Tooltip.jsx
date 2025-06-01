import * as RadixTooltip from '@radix-ui/react-tooltip';

export const IconTooltip = ({ icon: Icon, label }) => (
  <RadixTooltip.Provider>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>
        <div className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
          <Icon size={18} />
        </div>
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          sideOffset={5}
          className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow z-50"
        >
          {label}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);

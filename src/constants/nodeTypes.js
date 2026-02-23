export const NODE_TYPES = {
    TRIGGER: 'trigger',
    ACTION: 'action',
    CONDITION: 'condition',
    DELAY: 'delay',
    HTTP_REQUEST: 'httpRequest',
    END: 'end',
  }
  
  export const NODE_CONFIGS = {
    trigger: {
      label: 'Trigger',
      color: '#22c55e',      // green
      bgColor: '#052e16',
      borderColor: '#16a34a',
      icon: '⚡',
      defaultData: {
        label: 'Trigger',
        triggerType: 'manual',
      }
    },
    action: {
      label: 'Action',
      color: '#4f8ef7',      // blue
      bgColor: '#0c1a3d',
      borderColor: '#2563eb',
      icon: '⚙️',
      defaultData: {
        label: 'Action',
        description: '',
      }
    },
    condition: {
      label: 'Condition',
      color: '#eab308',      // yellow
      bgColor: '#1c1500',
      borderColor: '#ca8a04',
      icon: '◆',
      defaultData: {
        label: 'Condition',
        conditionLabel: '',
        testValue: 'true',
      }
    },
    delay: {
      label: 'Delay',
      color: '#a855f7',      // purple
      bgColor: '#1a0a2e',
      borderColor: '#7c3aed',
      icon: '⏱',
      defaultData: {
        label: 'Delay',
        duration: 2,
      }
    },
    httpRequest: {
      label: 'HTTP Request',
      color: '#f97316',      // orange
      bgColor: '#1c0a00',
      borderColor: '#ea580c',
      icon: '🌐',
      defaultData: {
        label: 'HTTP Request',
        url: '',
        method: 'GET',
      }
    },
    end: {
      label: 'End',
      color: '#ef4444',      // red
      bgColor: '#1c0000',
      borderColor: '#dc2626',
      icon: '⏹',
      defaultData: {
        label: 'End',
      }
    },
  }
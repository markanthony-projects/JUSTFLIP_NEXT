"use client";
import { useState } from "react";

// featureList used map through to display features.
const featureList = [
  { key: "emailNotif", title: "Email Notifications", desc: "Receive email notifications" },
  { key: "smsNotif", title: "SMS Notifications", desc: "Receive SMS notifications" },
  { key: "whatsAppNotif", title: "WhatsApp Notifications", desc: "Receive notifications on WhatsApp" },
];

// Reusable toggle UI.
// Takes: checked (boolean), onChange (function), disabled (boolean).   
function Toggle({ checked, onChange, disabled = false, name }) {
  return (
    <label className={`inline-flex items-center ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        name={name} // needed so handleChildToggle can read e.target.name
        className="sr-only peer" // sr-only hides the browser checkbox visually but keeps it accessible
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
        peer-focus:ring-white rounded-full peer
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute
        after:top-[2px] after:start-[2px] after:bg-white
        after:border-gray-300 after:border after:rounded-full
        after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002B5B]"
      />
    </label>
  );
}

const NotificationsSection = () => {
  const [parent, setParent] = useState(false);
  const [child, setChild] = useState({
    emailNotif: false,
    smsNotif: false,
    whatsAppNotif: false,
  });

  const handleParentToggle = () => {
    const newParentValue = !parent;
    setParent(newParentValue);

    // When parent turns on → turn all children on.
    setChild({
      emailNotif: newParentValue,
      smsNotif: newParentValue,
      whatsAppNotif: newParentValue,
    });
  };

  //now the child can work individually but also be dependent on the parent, if the parent is toggled then the child can be toggled but if the parent is off then the child cannot be toggled.
  const handleChildToggle = (e) => {
    const { name, checked } = e.target;

    const updatedChild = { ...child, [name]: checked };
    setChild(updatedChild);    
  };

  return (
    <div className="grid gap-4">

      {/* Parent toggle — enables/disables all notifications at once */}
      <div className="flex items-center justify-between text-[#1B2228] text-xl font-semibold py-4 pt-4">
        <p>Enable Notifications</p>
        <Toggle checked={parent} onChange={handleParentToggle} />
      </div>

      {/* children are disabled and also visually dimmed when parent is off.
          This prevents toggling individual items when notifications are globally off.  we also have added the parent state to keep a check that the other toggles are only available when the parent is toggled*/}
      {parent && featureList.map(({ key, title, desc }) => (
        <div key={key} className="grid justify-between grid-flow-col my-4">
          <div className="grid gap-1">
            <p className="text-base text-[#002B5B] font-semibold">{title}</p>
            <p className="text-sm text-[#14242E9E]">{desc}</p>
          </div>
          <Toggle
            name={key}
            checked={child[key]}
            onChange={handleChildToggle}
            disabled={!parent} //this helps disabling the child toggle when the parent is off
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationsSection;
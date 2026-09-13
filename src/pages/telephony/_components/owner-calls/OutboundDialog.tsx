import StartCallModal from "@/pages/telephony/_components/voice/StartCallModal";
import { useCapabilities } from "@/lib/capabilities";
import { useCan } from "@/stores/session";

/**
 * The owner's "start a call" (FE2 §3): the v2/v3 composer, shown only when
 * the backend reports outbound calling and the role may start calls.
 */
export function useOutboundAllowed(): boolean {
  const { caps } = useCapabilities();
  const canStart = useCan("start_call");
  return caps.outbound === true && canStart;
}

export default function OutboundDialog(props: React.ComponentProps<typeof StartCallModal>) {
  return <StartCallModal {...props} />;
}
